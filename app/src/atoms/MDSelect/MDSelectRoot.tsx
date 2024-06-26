import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import { TOwnerState } from "./types";

export default styled(Select)<TOwnerState>(({ theme, ownerState }) => {
  const { palette, borders, functions } = theme;
  const { transparent } = palette;
  const { showArrowIcon, variant } = ownerState;

  const { borderRadius } = borders;
  const { pxToRem } = functions;

  const arrowIcon = () => {
    if (showArrowIcon) {
      return {
        display: "block",
        fontSize: `${pxToRem(16)} !important`,
      };
    }
    return {};
  };

  const backgroundColor = variant === "outlined" ? palette.white.main : transparent.main;

  return {
    backgroundColor,
    borderRadius: borderRadius.md,
    "& .MuiSvgIcon-root": {
      ...arrowIcon(),
    },
  };
});
