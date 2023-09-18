import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDImageIcon from "atoms/MDImageIcon";
import ComplexStatisticsCard from "organisms/Cards/StatisticsCards/ComplexStatisticsCard";
import { indicatorServices } from "services";
import { inbound, outbound, totalTxn, activeSku } from "assets/images";
import selector from "../../selector";
import { TStatistics } from "./types";

function Statistics() {
  const { customerCode } = selector();
  const initialStatistics: TStatistics = {
    data: {
      today: {
        inboundSum: 0,
        outboundSum: 0,
        transactionCount: 0,
        activeSku: 0,
      },
      yesterday: {
        inboundSum: 0,
        outboundSum: 0,
        transactionCount: 0,
        activeSku: 0,
      },
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

  const {
    today: {
      inboundSum: tdaInboundSum,
      outboundSum: tdaOutboundSum,
      transactionCount: tdaTransactionCount,
      activeSku: tdaActiveSku,
    },
    yesterday: {
      inboundSum: ydaInboundSum,
      outboundSum: ydaOutboundSum,
      transactionCount: ydaTransactionCount,
      activeSku: ydaActiveSku,
    },
  } = statistics.data || {};

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
            image={<MDImageIcon src={inbound} alt="inbound" width="40px" height="40px" />}
            title="Inbound Weight"
            count={tdaInboundSum}
            percentage={{
              color: "dark",
              amount: ydaInboundSum,
              label: "Yesterday",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            image={<MDImageIcon src={outbound} alt="outbound" width="40px" height="40px" />}
            color="warning"
            title="Outbound Weight"
            count={tdaOutboundSum}
            percentage={{
              color: "dark",
              amount: ydaOutboundSum,
              label: "Yesterday",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            image={<MDImageIcon src={totalTxn} alt="totalTxn" width="40px" height="40px" />}
            color="dark"
            title="Total Transaction"
            count={tdaTransactionCount}
            percentage={{
              color: "dark",
              amount: ydaTransactionCount,
              label: "Yesterday",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            image={<MDImageIcon src={activeSku} alt="activeSku" width="40px" height="40px" />}
            color="primary"
            title="Active SKU"
            count={tdaActiveSku}
            percentage={{
              color: "dark",
              amount: ydaActiveSku,
              label: "Yesterday",
            }}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default Statistics;
