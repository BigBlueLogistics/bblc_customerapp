/* eslint-disable @typescript-eslint/no-unused-vars */
import MDInput from "atoms/MDInput";
import { styled } from "@mui/material/styles";

export default styled(MDInput)(({ theme }) => {
  const { palette, typography, borders } = theme;
  const { fontWeightRegular, fontFamily, size } = typography;

  return {
    minWidth: "200px",
    // fontFamily,
    // fontSize: size.sm,
    // textTransform: "capitalize",
    // fontWeight: fontWeightRegular,
    // // border: `${borders.borderWidth[1]} solid ${palette.inputBorderColor}`,
    // borderRadius: borders.borderRadius.md,
    // justifyContent: "space-between",
  };
});
