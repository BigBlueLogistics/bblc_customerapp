import React from "react";
import { TStatus } from "types/status";

export type TPieChart = {
  icon?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    component: React.ReactNode;
  };
  title?: string;
  description?: string | React.ReactNode;
  height?: string | number;
  chart: { [key: string]: any[] | { [key: string]: any } };
  status?: TStatus;
};
