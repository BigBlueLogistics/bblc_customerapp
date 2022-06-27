import { AvatarProps } from "@mui/material";

export type IMDAvatar = Partial<{
  bgColor:
    | "transparent"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";

  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  shadow: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "inset";
}> &
  AvatarProps;
