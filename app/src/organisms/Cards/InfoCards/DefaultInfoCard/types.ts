import React from "react";

export type TDefaultInfoCard = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  icon: React.ReactNode;
  title: string;
  description?: string;
  value?: number | string;
};
