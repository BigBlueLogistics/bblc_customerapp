import { LinearProgressProps } from "@mui/material";

export type IMDProgress = Partial<{
  variant: "contained" | "gradient";
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  value: number;
  label: boolean;
}> &
  Omit<LinearProgressProps, "variant" | "color">;
