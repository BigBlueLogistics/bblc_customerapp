import { useEffect, useState } from "react";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { indicatorServices } from "services";
import Transaction from "./Transactions";
import WtandPallets from "./WeightAndPallets";
import selector from "../../selector";
import { TWaveChart } from "./types";

function WaveChart() {
  const { customerCode } = selector();
  const initialChart: TWaveChart = {
    data: {
      inboundPerWeek: null,
      outboundPerWeek: null,
    },
    status: "idle",
    message: "",
  };
  const [chart, setChart] = useState<TWaveChart>(initialChart);

  const fetchInOutbound = async (customerCd: string) => {
    setChart((prev) => ({ ...prev, status: "loading" }));
    try {
      const { data: resp } = await indicatorServices.getInOutbound({
        params: {
          customer_code: customerCd,
        },
      });

      setChart((prev) => ({ ...prev, status: "succeeded", data: resp.data }));
    } catch (err) {
      setChart((prev) => ({ ...prev, status: "failed", data: null, message: err.message }));
    }
  };

  useEffect(() => {
    fetchInOutbound(customerCode);
  }, [customerCode]);

  const { inboundPerWeek, outboundPerWeek } = chart.data || {};

  if (chart.status === "failed") {
    return (
      <MDBox width="100%">
        <MDTypography variant="subtitle1">Cannot load charts.</MDTypography>
      </MDBox>
    );
  }

  return (
    <>
      <MDBox mt={4.5}>
        <Transaction data={inboundPerWeek} />
      </MDBox>
      <MDBox mt={4.5}>
        <WtandPallets data={outboundPerWeek} />
      </MDBox>
    </>
  );
}

export default WaveChart;
