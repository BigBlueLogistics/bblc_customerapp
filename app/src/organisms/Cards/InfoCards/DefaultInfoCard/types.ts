import React from "react";

export type IDefaultInfoCard = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  icon: React.ReactNode;
  title: string;
  description?: string;
  value?: number | string;
};
