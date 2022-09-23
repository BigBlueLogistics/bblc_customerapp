import { AvatarProps } from "@mui/material";

type IAvatar = Partial<{
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
}>;

export type IMDAvatar = IAvatar & AvatarProps;

export type IOwnerState = {
  ownerState?: IAvatar;
};
