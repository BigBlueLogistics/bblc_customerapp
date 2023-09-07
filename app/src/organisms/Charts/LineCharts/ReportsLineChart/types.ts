import React from "react";
import { TStatus } from "types/status";

export type TReportsLineChart = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  title: string;
  description?: string | React.ReactNode;
  date: string;
  chart: { [key: string]: any[] | { [key: string]: any } };
  status?: TStatus;
};
