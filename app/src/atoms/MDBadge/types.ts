import React from "react";
import { BadgeProps } from "@mui/material";

export type TBadge = Partial<{
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  variant: "gradient" | "contained";
  size: "xs" | "sm" | "md" | "lg";
  circular: boolean;
  indicator: boolean;
  border: boolean;
  children: React.ReactNode;
  container: boolean;
}>;

export type TMDBadge = TBadge & Omit<BadgeProps, "variant" | "color">;

export type TOwnerState = {
  ownerState?: TBadge;
};
