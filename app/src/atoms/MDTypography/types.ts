import React from "react";
import { TypographyProps } from "@mui/material";

export type ITypography = {
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark"
    | "text"
    | "white";
  fontWeight?: false | "light" | "regular" | "medium" | "bold";
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  verticalAlign?:
    | "unset"
    | "baseline"
    | "sub"
    | "super"
    | "text-top"
    | "text-bottom"
    | "middle"
    | "top"
    | "bottom";
  textGradient?: boolean;
  opacity?: number;
  children: React.ReactNode;
  component?: React.ReactNode;
};

export type IMDTypography =
  | (ITypography & Omit<TypographyProps, "fontWeight">)
  | { [key: string]: any };

export type IOwnerState = {
  ownerState?: Pick<
    ITypography,
    "color" | "fontWeight" | "textTransform" | "verticalAlign" | "textGradient" | "opacity"
  > & { darkMode: boolean };
};
