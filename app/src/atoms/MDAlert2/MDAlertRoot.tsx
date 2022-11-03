import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

export default styled(Alert)(({ theme }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { palette, typography, borders, functions } = theme;

  return {
    "& .MuiAlert-message": {
      display: "inline-flex",
      width: "100%",
      justifyContent: "space-between",
    },
  };
});
