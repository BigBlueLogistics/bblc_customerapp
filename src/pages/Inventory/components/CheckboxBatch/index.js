import Checkbox from "atoms/MDCheckbox";
import { styled } from "@mui/material/styles";

const CheckboxBatch = styled(Checkbox)(({ theme }) => {
  const { palette, typography } = theme;

  const { fontWeightRegular, size } = typography;

  return {
    marginLeft: 8,

    "& .MuiTypography-root": {
      color: `${palette.white.main} !important`,
      fontWeight: `${fontWeightRegular} !important`,
      fontSize: `${size.xs} !important`,
    },
  };
});

export default CheckboxBatch;
