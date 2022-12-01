import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import { IOwnerState } from "./types";

export default styled(Select)<IOwnerState>(({ theme, ownerState }) => {
  const { palette, borders, functions } = theme;
  const { background } = palette;
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

  const backgroundColor = variant === "outlined" ? palette.white.main : background.default;

  return {
    backgroundColor,
    borderRadius: borderRadius.md,

    "& .MuiSvgIcon-root": {
      ...arrowIcon(),
    },

    "&::before": {
      borderBottom: "none",
    },
  };
});
