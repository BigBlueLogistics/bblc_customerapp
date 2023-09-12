import { useEffect, useState } from "react";
import MDBox from "atoms/MDBox";
import { indicatorServices } from "services";
import { ResponseIndicatorsWtPalletsEntity } from "entities/indicators";
import ByWeight from "./ByWeight";
import ByPallets from "./ByPallets";
import selector from "../../selector";

function WaveChart() {
  const { customerCode } = selector();
  const initialInOutbound: ResponseIndicatorsWtPalletsEntity = {
    data: {
      byWeight: null,
      byPalletCount: null,
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
      <MDBox mt={4.5}>
        <ByWeight data={inOutBoundChart} />
      </MDBox>
      <MDBox mt={4.5}>
        <ByPallets data={inOutBoundChart} />
      </MDBox>
    </>
  );
}

export default WaveChart;
