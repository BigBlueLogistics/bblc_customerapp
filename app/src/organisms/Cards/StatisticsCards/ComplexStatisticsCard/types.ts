import React from "react";

export type TComplexStatisticsCard = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  title: string;
  count: string | number;
  percentage?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "white";
    amount: string | number;
    label: string;
  };
  icon: React.ReactNode;
};
