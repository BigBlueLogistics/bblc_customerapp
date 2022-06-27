import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import { IMaterialElem } from "types/materialElem";

export default styled(Select)<IMaterialElem>(({ theme, ownerState }) => {
  const { palette, borders, functions } = theme;
  const { background } = palette;
  const { showArrowIcon } = ownerState;

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

  return {
    background: background.default,
    padding: 8,
    borderRadius: borderRadius.md,

    "& .MuiSvgIcon-root": {
      ...arrowIcon(),
    },
  };
});
