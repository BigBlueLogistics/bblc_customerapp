import React from "react";
import { AlertProps, SxProps, Theme } from "@mui/material";

type IMDAlert = {
  severity?: AlertProps["color"];
  variant?: AlertProps["variant"];
  dismissible?: boolean;
  autoUnmount?: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default IMDAlert;
