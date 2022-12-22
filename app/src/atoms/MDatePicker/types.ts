import { SxProps, Theme } from "@mui/material";

export type IDatePick = {
  value?: string | number;
  onClick?: () => void;
  label?: string;
  inputStyle?: SxProps<Theme>;
};

export type IMDatePicker = {
  onChange: (date: Date) => void;
  containerStyle?: SxProps<Theme>;
  inputStyle?: SxProps<Theme>;
  label?: string;
  disabled?: boolean;
};
