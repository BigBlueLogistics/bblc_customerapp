import React from "react";
import { TStatus } from "types/status";

export type TReportsBarChart = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  title: string;
  description?: string | React.ReactNode;
  date: string;
  chart: { [key: string]: any[] | { [key: string]: any } };
  status?: TStatus;
};
