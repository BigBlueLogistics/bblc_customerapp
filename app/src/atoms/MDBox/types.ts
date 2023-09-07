import { BoxProps } from "@mui/material";

export type TBox = {
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

export type TMDBox = (TBox & BoxProps) | { [key: string]: any };

export type TOwnerState = {
  ownerState?: TBox;
};
