import { BoxProps } from "@mui/material";

export type IMDBox =
  | ({
      variant?: "contained" | "gradient";
      bgColor?: string;
      color?: string;
      opacity?: number;
      borderRadius?: string;
      shadow?: string;
      coloredShadow?:
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "light"
        | "dark"
        | "none";
    } & BoxProps)
  | { [key: string]: any };
