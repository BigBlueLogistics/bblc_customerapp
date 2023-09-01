import React from "react";
import { IStatus } from "types/status";

export type IProgressLineChart = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  icon: React.ReactNode;
  title: string;
  count?: string | number;
  progress: number;
  height?: string | number;
  chart: { [key: string]: any[] };
  status?: IStatus;
};
