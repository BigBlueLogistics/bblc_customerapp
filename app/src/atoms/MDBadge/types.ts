import React from "react";
import { BadgeProps } from "@mui/material";

export type IBadge = Partial<{
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  variant: "gradient" | "contained";
  size: "xs" | "sm" | "md" | "lg";
  circular: boolean;
  indicator: boolean;
  border: boolean;
  children: React.ReactNode;
  container: boolean;
}>;

export type IMDBadge = IBadge & Omit<BadgeProps, "variant" | "color">;

export type IOwnerState = {
  ownerState?: IBadge;
};
