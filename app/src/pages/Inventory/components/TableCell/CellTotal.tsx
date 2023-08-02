import MDTypography from "atoms/MDTypography";
import MDBox from "atoms/MDBox";
import { formatDecimal } from "utils";

function CellTotal({
  data,
  getValueByKey,
  prefix,
}: {
  data: Record<string, number>[];
  getValueByKey: string;
  prefix: string;
}) {
  let ctotal = 0;
  if (data.length) {
    ctotal = data.reduce((total: number, current: Record<string, any>) => {
      let sum = total;
      sum += Number(current.original[getValueByKey]) || 0;
      return sum;
    }, 0);
  }

  const ctotalRoundoff = ctotal > 0 ? formatDecimal(ctotal, 3) : 0;

  return (
    <MDBox sx={{ textWrap: "nowrap", textAlign: "right" }}>
      <MDTypography
        variant="subtitle2"
        component="span"
        sx={({ typography: { pxToRem } }) => ({ fontSize: pxToRem(14) })}
      >
        {prefix}:{" "}
      </MDTypography>
      <MDTypography variant="h6" component="span">
        {ctotalRoundoff}
      </MDTypography>
    </MDBox>
  );
}

export default CellTotal;
