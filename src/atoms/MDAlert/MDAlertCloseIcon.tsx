import { styled } from "@mui/material/styles";
import { IMaterialElem } from "types/materialElem";

export default styled("span")<IMaterialElem>(({ theme }) => {
  const { palette, typography, functions } = theme;

  const { white } = palette;
  const { size, fontWeightMedium } = typography;
  const { pxToRem } = functions;

  return {
    color: white.main,
    fontSize: size.xl,
    padding: `${pxToRem(9)} ${pxToRem(6)} ${pxToRem(8)}`,
    marginLeft: pxToRem(40),
    fontWeight: fontWeightMedium,
    cursor: "pointer",
    lineHeight: 0,
  };
});
