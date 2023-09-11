import { Grid } from "@mui/material";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import StackedBarChart from "organisms/Charts/BarCharts/StackedBarChart";
import { TWtandPallets } from "./types";

function WtandPallets({ data }: TWtandPallets) {
  const { data: transData, status } = data;
  const { transactions, transactionsDates, coverageDate } = transData;

  const labels = transactionsDates || null;
  const coverage = coverageDate || null;

  const dataSets = () => {
    if (transactions) {
      return transactions.map((item, idx) => {
        if (idx === 0) {
          return {
            label: "Inbound",
            data: item,
            backgroundColor: "rgb(53, 162, 235)",
          };
        }

        return {
          label: "Outbound",
          data: item,
          backgroundColor: "rgb(255, 167, 38)",
        };
      });
    }
    return null;
  };

  const description =
    status === "succeeded" ? (
      <MDTypography variant="button" fontWeight="light" color="text">
        {coverage}
      </MDTypography>
    ) : null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MDBox mb={3}>
          <StackedBarChart
            title="Inbound/Outbound by Weight and Pallets"
            description={description}
            chart={{
              labels,
              datasets: dataSets(),
            }}
            status={status}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default WtandPallets;
