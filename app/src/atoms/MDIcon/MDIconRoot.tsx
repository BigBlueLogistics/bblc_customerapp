import Icon from "@mui/material/Icon";
import { styled } from "@mui/material/styles";
import { TOwnerState } from "./types";

export default styled(Icon)<TOwnerState>(({ theme, ownerState = {} }) => {
  const {
    typography: { pxToRem },
  } = theme;
  const { fontSize } = ownerState;

  if (typeof fontSize === "number") {
    return {
      "&.material-icons-round": {
        fontSize: `${pxToRem(fontSize)} !important`,
      },
    };
  }

  return {};
});
