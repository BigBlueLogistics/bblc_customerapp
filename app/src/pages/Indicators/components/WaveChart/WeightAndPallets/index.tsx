import { Grid } from "@mui/material";
import MDBox from "atoms/MDBox";
import ReportsLineChart from "organisms/Charts/LineCharts/ReportsLineChart";
import { IStatus } from "types/status";
import { TWaveChart } from "../types";

function WtandPallets({
  data,
  status,
}: {
  data: TWaveChart["data"]["outboundPerWeek"];
  status: IStatus;
}) {
  const labels = data ? Object.keys(data) : [];
  const dataSets = data ? Object.values(data).flatMap((item) => item.weight) : [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MDBox mb={3}>
          <ReportsLineChart
            color="success"
            title="Inbound/Outbound by Weight and Pallets"
            description={<div>weekly</div>}
            date="updated today"
            chart={{
              labels,
              datasets: {
                label: "Inbound/Outbound",
                data: dataSets,
              },
            }}
            status={status}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default WtandPallets;
