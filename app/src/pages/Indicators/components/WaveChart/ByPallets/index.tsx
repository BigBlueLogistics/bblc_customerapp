import { Grid } from "@mui/material";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import StackedBarChart from "organisms/Charts/BarCharts/StackedBarChart";
import { TByPallets } from "./types";

function ByPallets({ data }: TByPallets) {
  const { data: transData, status } = data;
  const { byPalletCount, transactionsDates } = transData;

  const labels = transactionsDates || null;

  const dataSets = () => {
    if (byPalletCount) {
      return byPalletCount.map((item, idx) => {
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MDBox mb={3}>
          <StackedBarChart
            title="By Pallets"
            description={
              <MDTypography variant="button" fontWeight="light" color="text">
                Inbound/Outbound by Transactions and Pallets
              </MDTypography>
            }
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

export default ByPallets;
