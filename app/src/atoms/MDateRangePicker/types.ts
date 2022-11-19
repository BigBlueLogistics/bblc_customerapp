import { SxProps, Theme } from "@mui/material";

export type IMDateRangePicker = {
  onChange: (date: [Date, Date]) => void;
  containerStyle?: SxProps<Theme>;
  buttonStyle?: SxProps<Theme>;
};
