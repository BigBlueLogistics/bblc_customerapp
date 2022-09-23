import { TextFieldProps } from "@mui/material";

export type IInput = Partial<{
  error: boolean;
  success: boolean;
  disabled: boolean;
}>;

export type IMDInput = IInput & TextFieldProps;

export type IOwnerState = {
  ownerState?: IInput;
};
