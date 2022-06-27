/* eslint-disable @typescript-eslint/no-unused-vars */
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import { IMaterialElem } from "types/materialElem";

export default styled(FormControl)<IMaterialElem>(({ theme, ownerState }) => {
  const { palette, typography } = theme;
  const { white } = palette;

  const { fontWeightRegular } = typography;

  return {
    "& .MuiFormHelperText-root": {
      color: white.main,
      marginLeft: 0,
      marginBottom: 5,
      fontWeight: fontWeightRegular,
    },
  };
});
