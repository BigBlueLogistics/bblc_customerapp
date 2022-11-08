import { ButtonProps } from "@mui/material";
import React from "react";

type IButton = Partial<{
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
  loading: boolean;
}>;

export type IMDButton =
  | ({
      children: React.ReactNode;
    } & IButton &
      Omit<ButtonProps, "variant" | "color">)
  | { [key: string]: any };

export type IOwnerState = {
  ownerState?: IButton & { darkMode: boolean };
};
