import { TextFieldProps } from "@mui/material";

export type TInput = Partial<{
  error: boolean;
  success: boolean;
  disabled: boolean;
  endAdornment?: boolean;
}>;

export type TMDInput = TInput & TextFieldProps;

export type TOwnerState = {
  ownerState?: TInput;
};
