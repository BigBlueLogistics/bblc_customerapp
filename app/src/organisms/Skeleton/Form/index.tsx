import MDBox from "atoms/MDBox";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { IForm } from "./types";

function Form({ contentWidth }: IForm) {
  return (
    <MDBox padding={2}>
      <Stack spacing={1}>
        <Skeleton width="100%" height={64} />
        <Skeleton width="100%" height={contentWidth} variant="rectangular" />
        <Skeleton width="100%" height={64} />
      </Stack>
    </MDBox>
  );
}

export default Form;
