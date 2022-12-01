import MDButton from "atoms/MDButton";
import { styled } from "@mui/material/styles";

export default styled(MDButton)(({ theme }) => {
  const { palette, typography, borders } = theme;
  const { fontWeightRegular, fontFamily, size } = typography;

  return {
    minWidth: "150px",
    fontFamily,
    fontSize: size.sm,
    textTransform: "capitalize",
    fontWeight: fontWeightRegular,
    border: `${borders.borderWidth[1]} solid ${palette.inputBorderColor}`,
    borderRadius: borders.borderRadius.md,
    justifyContent: "space-between",
  };
});
