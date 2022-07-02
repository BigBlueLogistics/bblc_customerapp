import { BoxProps } from "@mui/material";

export type IBox = {
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
};

export type IMDBox = (IBox & BoxProps) | { [key: string]: any };

export type IOwnerState = {
  ownerState?: IBox;
};
