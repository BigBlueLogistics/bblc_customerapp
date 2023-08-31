import { useEffect, useState } from "react";
import MDBox from "atoms/MDBox";
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

  return (
    <>
      <MDBox mt={4.5}>
        <Transaction data={inboundPerWeek} status={chart.status} />
      </MDBox>
      <MDBox mt={4.5}>
        <WtandPallets data={outboundPerWeek} status={chart.status} />
      </MDBox>
    </>
  );
}

export default WaveChart;
