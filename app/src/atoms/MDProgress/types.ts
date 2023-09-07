import { LinearProgressProps } from "@mui/material";

export type TProgress = Partial<{
  variant: "contained" | "gradient";
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  value: number;
  label: boolean;
}>;

export type TMDProgress = TProgress & Omit<LinearProgressProps, "variant" | "color">;

export type TOwnerState = {
  ownerState?: TProgress;
};
