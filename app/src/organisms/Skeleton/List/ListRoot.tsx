import { Skeleton, styled } from "@mui/material";
import { TOwnerState } from "./types";

export default styled(Skeleton)<TOwnerState>(({ theme, ownerState }) => {
  const {
    palette: { grey },
  } = theme;
  const { darkMode } = ownerState;

  return {
    backgroundColor: darkMode ? "transparent" : grey["200"],
  };
});
