import { styled } from "@mui/material/styles";
import { TMaterialElem } from "types/materialElem";

export default styled("span")<TMaterialElem>(({ theme }) => {
  const { palette, typography, functions } = theme;

  const { dark } = palette;
  const { size, fontWeightMedium } = typography;
  const { pxToRem } = functions;

  return {
    color: dark.main,
    fontSize: size.xl,
    padding: `${pxToRem(9)} ${pxToRem(6)} ${pxToRem(8)}`,
    fontWeight: fontWeightMedium,
    cursor: "pointer",
    lineHeight: 0,
  };
});
