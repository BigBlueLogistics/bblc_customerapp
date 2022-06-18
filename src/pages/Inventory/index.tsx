import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";

import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";

import miscData from "pages/Inventory/data";
import inventoryServices from "services/inventoryServices";

function Inventory() {
  const { tableHeaders, groupOpts } = miscData();
  const [selectedGroupBy, setSelectedGroupBy] = useState("material");
  const [selectedFilterBy, setSelectedFilterBy] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [rowsInventory, setRowsInventory] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChangeGroupBy = (e) => {
    console.log(e.target.value);
    setSelectedGroupBy(e.target.value);
  };

  const onChangeFilterBy = (e) => {
    console.log("warehouse: ", e.target.value);
    setSelectedFilterBy(e.target.value);
  };

  const fetchInventoryTable = async () => {
    setLoading(true);

    try {
      const tableBody = {
        customer_code: "FGVIRGIN",
        warehouse: selectedFilterBy,
        group_by: selectedGroupBy,
      };

      const { data: rows } = await inventoryServices.getTableData({ params: tableBody });

      setRowsInventory(rows.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseList = async () => {
    setLoading(true);

    try {
      const { data: rows } = await inventoryServices.getWarehouseList();

      setWarehouseList(rows.data);
      if (rows.data.length) {
        setSelectedFilterBy(rows.data[0].PLANT);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    fetchInventoryTable();
  }, [selectedGroupBy, selectedFilterBy]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox>
                  <MDSelect
                    helperText="Group by"
                    onChange={onChangeGroupBy}
                    options={groupOpts}
                    value={selectedGroupBy}
                    showArrowIcon
                  />

                  <MDSelect
                    helperText="Filter by"
                    onChange={onChangeFilterBy}
                    options={warehouseList}
                    value={selectedFilterBy}
                    showArrowIcon
                    optKeyValue="PLANT"
                    optKeyLabel="NAME1"
                  />
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <MDTypography ml={3} variant="h4" color="black" textTransform="uppercase">
                  Material Details
                </MDTypography>
                <DataTable
                  table={{ columns: tableHeaders[selectedGroupBy], rows: rowsInventory }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
                  showTotalEntries
                  noEndBorder
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Inventory;
