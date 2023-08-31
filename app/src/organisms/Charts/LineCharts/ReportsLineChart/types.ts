import React from "react";
import { IStatus } from "types/status";

export type IReportsLineChart = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  title: string;
  description?: string | React.ReactNode;
  date: string;
  chart: { [key: string]: any[] | { [key: string]: any } };
  status?: IStatus;
};
