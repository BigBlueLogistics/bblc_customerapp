import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import ComplexStatisticsCard from "organisms/Cards/StatisticsCards/ComplexStatisticsCard";
import { indicatorServices } from "services";
import selector from "../../selector";
import { TStatistics } from "./types";

function Statistics() {
  const { customerCode } = selector();
  const initialStatistics: TStatistics = {
    data: {
      inboundSum: 0,
      outboundSum: 0,
      transactionCount: 0,
      activeSku: 0,
    },
    status: "idle",
    message: "",
  };
  const [statistics, setStatistics] = useState<TStatistics>(initialStatistics);

  const fetchActiveSKu = async (customerCd: string) => {
    setStatistics((prev) => ({ ...prev, status: "loading" }));
    try {
      const { data: resp } = await indicatorServices.getActiveSku({
        params: {
          customer_code: customerCd,
        },
      });

      setStatistics((prev) => ({ ...prev, status: "succeeded", data: resp.data }));
    } catch (err) {
      setStatistics((prev) => ({ ...prev, status: "failed", data: null, message: err.message }));
    }
  };

  useEffect(() => {
    fetchActiveSKu(customerCode);
  }, [customerCode]);

  const { inboundSum, outboundSum, transactionCount, activeSku } = statistics.data || {};

  if (statistics.status === "failed") {
    return (
      <MDBox width="100%">
        <MDTypography variant="subtitle1">Cannot load statistics.</MDTypography>
      </MDBox>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="dark"
            icon="weekend"
            title="Inbound Weight"
            count={inboundSum}
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
            count={outboundSum}
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
            count={transactionCount}
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
            count={activeSku}
            percentage={{
              color: "success",
              amount: "",
              label: "Today",
            }}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default Statistics;
