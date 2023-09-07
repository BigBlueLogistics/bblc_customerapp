import { ButtonProps } from "@mui/material";
import React from "react";

type TButton = Partial<{
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

export type TMDButton =
  | ({
      children: React.ReactNode;
    } & TButton &
      Omit<ButtonProps, "variant" | "color">)
  | { [key: string]: any };

export type TOwnerState = {
  ownerState?: TButton & { darkMode: boolean };
};
