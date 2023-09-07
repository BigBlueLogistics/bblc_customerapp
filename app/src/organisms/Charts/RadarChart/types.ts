import React from "react";
import { TStatus } from "types/status";

export type TRadarChart = {
  icon?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    component: React.ReactNode;
  };
  title?: string;
  description?: string | React.ReactNode;
  chart: { [key: string]: any[] };
  status?: TStatus;
};
