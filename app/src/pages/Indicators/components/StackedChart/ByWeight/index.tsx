import { Grid } from "@mui/material";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import StackedBarChart from "organisms/Charts/BarCharts/StackedBarChart";
import { TByWeight } from "./types";

function ByWeight({ data }: TByWeight) {
  const { data: transData, status } = data;
  const { byWeight } = transData || {};

  const labels = byWeight?.dates || null;

  const dataSets = () => {
    if (byWeight?.weight) {
      return byWeight.weight.map((item, idx) => {
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
            title="By Weight"
            description={
              <MDTypography variant="button" fontWeight="light" color="text">
                Inbound/Outbound by Accumulated Weight per Day
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

export default ByWeight;
