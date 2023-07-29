import { SxProps, Theme, TextFieldProps } from "@mui/material";
import { ReactDatePickerProps } from "react-datepicker";

export type IDatePick = {
  value?: string | number;
  onClick?: () => void;
  label?: string;
  inputStyle?: SxProps<Theme>;
  variant?: TextFieldProps["variant"];
};

export type IMDatePicker = {
  onChange: (date: Date) => void;
  name?: string;
  defaultValue?: Date | null;
  containerStyle?: SxProps<Theme>;
  inputStyle?: SxProps<Theme>;
  label?: string;
  disabled?: boolean;
  inputVariant?: TextFieldProps["variant"];
} & ReactDatePickerProps;
