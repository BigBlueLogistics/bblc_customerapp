import { LinearProgressProps } from "@mui/material";

export type IProgress = Partial<{
  variant: "contained" | "gradient";
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  value: number;
  label: boolean;
}>;

export type IMDProgress = IProgress & Omit<LinearProgressProps, "variant" | "color">;

export type IOwnerState = {
  ownerState?: IProgress;
};
