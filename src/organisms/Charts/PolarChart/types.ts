import React from "react";

export type IPolarChart = {
  icon?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    component: React.ReactNode;
  };
  title?: string;
  description?: string | React.ReactNode;
  chart: { [key: string]: any[] | { [key: string]: any } };
};
