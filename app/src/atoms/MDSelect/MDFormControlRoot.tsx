import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";

export default styled(FormControl)(({ theme }) => {
  const { palette, typography } = theme;
  const { white } = palette;

  const { fontWeightRegular } = typography;

  return {
    minWidth: "130px",
    "& .MuiFormHelperText-root": {
      color: white.main,
      marginLeft: 0,
      marginBottom: 5,
      fontWeight: fontWeightRegular,
    },
  };
});
