import React from "react";

export type TTransaction = {
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  icon: React.ReactNode;
  name: string;
  description: string;
  value: string;
};
