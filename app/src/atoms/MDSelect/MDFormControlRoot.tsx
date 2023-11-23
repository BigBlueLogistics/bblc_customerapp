import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import { TOwnerState } from "./types";

export default styled(FormControl)<TOwnerState>(({ theme, ownerState }) => {
  const { palette, typography } = theme;
  const { variant } = ownerState;
  const { white } = palette;

  const { fontWeightRegular } = typography;

  const backgroundColor = () => {
    if (variant === "outlined") {
      return {
        "& .MuiOutlinedInput-root ": {
          backgroundColor: `${palette.searchFilter.input.main} !important`,
        },
      };
    }
    return {};
  };

  return {
    minWidth: "130px",
    ...backgroundColor(),
    "& .MuiFormHelperText-root": {
      color: white.main,
      marginLeft: 0,
      marginBottom: 5,
      fontWeight: fontWeightRegular,
    },
  };
});
