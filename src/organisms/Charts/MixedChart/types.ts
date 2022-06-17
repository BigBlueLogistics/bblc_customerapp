import React from "react";

export type IMixedChart = {
  icon?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    component: React.ReactNode;
  };
  title?: string;
  description?: string | React.ReactNode;
  height?: string | number;
  chart: { [key: string]: any[] };
};
