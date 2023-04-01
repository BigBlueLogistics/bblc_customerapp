import Grid from "@mui/material/Grid";
import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import ReportsLineChart from "organisms/Charts/LineCharts/ReportsLineChart";
import HorizontalBarChart from "organisms/Charts/BarCharts/HorizontalBarChart";
import ComplexStatisticsCard from "organisms/Cards/StatisticsCards/ComplexStatisticsCard";

import reportsHorizontalData from "pages/Indicators/data/reportsHorizontalData";
import reportsLineChartData from "pages/Indicators/data/reportsLineChartData";

function Indicators() {
  const { sales } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Inbound Weight"
                count={0}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Outbound Weight"
                count="0"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total Transaction"
                count="0"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Active SKU"
                count="0"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Today",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
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
