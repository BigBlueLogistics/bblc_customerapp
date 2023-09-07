import React from "react";
import { AlertProps, SxProps, Theme } from "@mui/material";

type TMDAlert = {
  severity?: AlertProps["color"];
  variant?: AlertProps["variant"];
  dismissible?: boolean;
  autoHideDuration?: number | null;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default TMDAlert;
