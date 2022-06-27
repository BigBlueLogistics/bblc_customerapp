import React from "react";
import { IMDButton } from "atoms/MDButton/types";

export type IMDPagination = {
  item?: boolean;
  variant?: "gradient" | "contained";
  color?:
    | "white"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";
  size?: "small" | "medium" | "large";
  active?: boolean;
  children: React.ReactNode;
} & IMDButton;
