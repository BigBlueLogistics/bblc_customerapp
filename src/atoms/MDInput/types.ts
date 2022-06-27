import { TextFieldProps } from "@mui/material";

export type IMDInput = Partial<{
  error: boolean;
  success: boolean;
  disabled: boolean;
}> &
  TextFieldProps;
