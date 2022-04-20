import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";

import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";

import authorsTableData from "pages/tables/data/authorsTableData";

function Inventory() {
  const { columns, rows } = authorsTableData();
  const [selectedGroup, setSelectedGroup] = useState("");

  const groupOpts = [
    {
      value: "material",
      label: "Material Codes",
    },
    {
      value: "batch",
      label: "Batch Codes",
    },
  ];

  const onChangeGrouping = (e) => {
    setSelectedGroup(e.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                <MDTypography variant="h6" color="white">
                  <MDSelect
                    label="Select Grouping"
                    onChange={onChangeGrouping}
                    selectedOption={selectedGroup}
                    options={groupOpts}
                  />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
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
