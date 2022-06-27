import React from "react";

export type IBubbleChart = {
  icon?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    component: React.ReactNode;
  };
  title?: string;
  description?: string | React.ReactNode;
  height?: string | number;
  chart: { [key: string]: any[] };
};
