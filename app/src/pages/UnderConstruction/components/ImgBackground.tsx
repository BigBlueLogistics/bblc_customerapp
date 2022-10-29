import { styled } from "@mui/material/styles";
import { IMaterialElem } from "types/materialElem";

export default styled("img")<IMaterialElem>(({ theme }) => {
  const { typography, breakpoints } = theme;
  const { pxToRem } = typography;

  return {
    width: pxToRem(260),
    height: pxToRem(235),

    [breakpoints.up("sm")]: {
      width: pxToRem(380),
      height: pxToRem(330),
    },

    [breakpoints.up("md")]: {
      width: pxToRem(480),
      height: pxToRem(425),
    },
  };
});
