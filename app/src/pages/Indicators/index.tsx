import Grid from "@mui/material/Grid";
import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import HorizontalBarChart from "organisms/Charts/BarCharts/HorizontalBarChart";

import reportsHorizontalData from "pages/Indicators/data/reportsHorizontalData";
import Statistics from "./components/Statistics";
import WaveChart from "./components/WaveChart";

function Indicators() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Statistics />
        <WaveChart />
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <HorizontalBarChart
                  icon={{ color: "info", component: "splitscreen" }}
                  title="Title here"
                  description={" "}
                  chart={reportsHorizontalData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <HorizontalBarChart
                  icon={{ color: "primary", component: "splitscreen" }}
                  title="Title here"
                  description={" "}
                  chart={reportsHorizontalData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Indicators;
