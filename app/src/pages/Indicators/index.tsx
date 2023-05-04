import Grid from "@mui/material/Grid";
import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import ReportsLineChart from "organisms/Charts/LineCharts/ReportsLineChart";
import HorizontalBarChart from "organisms/Charts/BarCharts/HorizontalBarChart";

import reportsHorizontalData from "pages/Indicators/data/reportsHorizontalData";
import reportsLineChartData from "pages/Indicators/data/reportsLineChartData";
import Statistics from "./components/Statistics";

function Indicators() {
  const { sales } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Statistics />
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Inbound/Outbound by Transactions"
                  description={
                    <>
                      (<strong>+15%</strong>) weekly.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Inbound/Outbound by Weight and Pallets"
                  description={
                    <>
                      (<strong>+20%</strong>) weekly.
                    </>
                  }
                  date="updated"
                  chart={sales}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
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
