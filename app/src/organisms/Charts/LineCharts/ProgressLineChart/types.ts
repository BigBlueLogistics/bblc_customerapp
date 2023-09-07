import React from "react";
import { TStatus } from "types/status";

export type TProgressLineChart = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  icon: React.ReactNode;
  title: string;
  count?: string | number;
  progress: number;
  height?: string | number;
  chart: { [key: string]: any[] };
  status?: TStatus;
};
