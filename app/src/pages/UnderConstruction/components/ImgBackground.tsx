import { styled } from "@mui/material/styles";
import { IMaterialElem } from "types/materialElem";

export default styled("img")<IMaterialElem>(({ theme }) => {
  const { typography, breakpoints } = theme;
  const { pxToRem } = typography;

  return {
    width: pxToRem(260),
    height: pxToRem(235),

    [breakpoints.up("sm")]: {
      width: pxToRem(400),
      height: pxToRem(355),
    },

    [breakpoints.up("md")]: {
      width: pxToRem(520),
      height: pxToRem(465),
    },
  };
});
