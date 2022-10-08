import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useDownloadFile } from "hooks";

import miscData from "pages/Inventory/data";
import inventoryServices from "services/inventoryService";

function Inventory() {
  const { tableHeaders, groupOpts } = miscData();
  const [showNotifyDownload, setShowNotifyDownload] = useState({
    open: false,
    message: "",
    title: "",
  });
  const [selectedGroupBy, setSelectedGroupBy] = useState("material");
  const [selectedFilterBy, setSelectedFilterBy] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [rowsInventory, setRowsInventory] = useState([]);
  const [action, setAction] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { downloadFile, status: downloadStatus } = useDownloadFile();
  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotifyDownload = (message: string, title: string) => {
    setShowNotifyDownload({ open: true, message, title });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload({ open: false, message: "", title: "" });
  };

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
        warehouse: "WH05", // selectedFilterBy
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

  const exportToExcel = () => {
    const data = { customer_code: "FGVIRGIN", warehouse: "WH05" };

    downloadFile({ url: "/inventory/export-excel", filename: "Stocks Inventory", data });
    closeAction();
  };

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    fetchInventoryTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupBy, selectedFilterBy]);

  useEffect(() => {
    if (downloadStatus === "loading") {
      openNotifyDownload("Please wait exporting file [Stocks Inventory.xlsx]", "Exporting File");
    }
    if (downloadStatus === "done") {
      openNotifyDownload("You can now open [Stocks Inventory.xlsx]", "Export to excel complete!");
    }
  }, [downloadStatus]);

  const renderAction = (
    <Menu
      id="action"
      anchorEl={action}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(action)}
      onClose={closeAction}
    >
      <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
    </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <MDSnackbar
        color="info"
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        onClose={closeNotifyDownload}
        close={closeNotifyDownload}
      />

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
                <MDBox display="flex">
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

                  <MDBox my="auto" marginLeft="auto">
                    <Icon
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                      fontSize="small"
                      onClick={openAction}
                    >
                      more_vert
                    </Icon>
                  </MDBox>
                  {renderAction}
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <MDTypography ml={3} variant="h4" color="dark" textTransform="uppercase">
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
