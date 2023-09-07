import { AvatarProps } from "@mui/material";

type TAvatar = Partial<{
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

export type TMDAvatar = TAvatar & AvatarProps;

export type TOwnerState = {
  ownerState?: TAvatar;
};
