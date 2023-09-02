import { Grid } from "@mui/material";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import ReportsLineChart from "organisms/Charts/LineCharts/ReportsLineChart";
import { IStatus } from "types/status";
import { TWaveChart } from "../types";

function Transaction({
  data,
  status,
  coverageDate,
}: {
  data: TWaveChart["data"]["inboundPerWeek"];
  status: IStatus;
  coverageDate: string;
}) {
  const labels = data ? Object.keys(data) : [];
  const dataSets = data ? Object.values(data).flatMap((item) => item.weight) : [];
  const description =
    status === "succeeded" ? (
      <MDTypography variant="button" fontWeight="light" color="text">
        weekly of ({coverageDate})
      </MDTypography>
    ) : null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MDBox mb={3}>
          <ReportsLineChart
            color="success"
            title="Inbound/Outbound by Transactions"
            description={description}
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

export default Transaction;
