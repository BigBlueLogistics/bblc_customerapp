import { useEffect, useState } from "react";
import MDBox from "atoms/MDBox";
import { indicatorServices } from "services";
import { ResponseIndicatorsWtPalletsEntity } from "entities/indicators";
// import Transaction from "./Transactions";
import WtandPallets from "./WeightAndPallets";
import selector from "../../selector";

function WaveChart() {
  const { customerCode } = selector();
  const initialInOutbound: ResponseIndicatorsWtPalletsEntity = {
    data: {
      transactions: null,
      transactionsDates: null,
    },
    status: "idle",
    message: "",
  };
  const [inOutBoundChart, setInOutBoundChart] = useState(initialInOutbound);

  const fetchInOutbound = async (customerCd: string) => {
    setInOutBoundChart((prev) => ({ ...prev, status: "loading" }));
    try {
      const { data: resp } = await indicatorServices.getInOutbound({
        params: {
          customer_code: customerCd,
        },
      });

      setInOutBoundChart((prev) => ({ ...prev, status: "succeeded", data: resp.data }));
    } catch (err) {
      setInOutBoundChart((prev) => ({
        ...prev,
        status: "failed",
        data: null,
        message: err.message,
      }));
    }
  };

  useEffect(() => {
    fetchInOutbound(customerCode);
  }, [customerCode]);

  return (
    <>
      {/* <MDBox mt={4.5}>
        <Transaction data={outboundPerWeek} status={inOutBoundChart.status} coverageDate={coverageDate} />
      </MDBox> */}
      <MDBox mt={4.5}>
        <WtandPallets data={inOutBoundChart} />
      </MDBox>
    </>
  );
}

export default WaveChart;
