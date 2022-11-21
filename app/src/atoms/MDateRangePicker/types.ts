import { SxProps, Theme } from "@mui/material";

export type IDatePickInput = {
  value?: string | number;
  onClick?: () => void;
  label?: string;
  buttonStyle?: SxProps<Theme>;
};

export type IMDateRangePicker = {
  onChange: (date: [Date, Date]) => void;
  containerStyle?: SxProps<Theme>;
  buttonStyle?: SxProps<Theme>;
  label?: string;
};
