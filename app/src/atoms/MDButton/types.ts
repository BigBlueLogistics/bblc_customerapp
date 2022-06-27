import { ButtonProps } from "@mui/material";
import React from "react";

type Base = Partial<{
  size?: "small" | "medium" | "large";
  variant?: "text" | "contained" | "outlined" | "gradient";
  color:
    | "white"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";
  circular: boolean;
  iconOnly: boolean;
}>;

export type IMDButton =
  | ({
      children: React.ReactNode;
    } & Base &
      Omit<ButtonProps, "variant" | "color">)
  | { [key: string]: any };
