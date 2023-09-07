import { IconProps } from "@mui/material";
import { LooseType } from "types/utility";

export type TIcon = {
  fontSize?: LooseType<IconProps["fontSize"]> | number;
};

export type TMDIcon = TIcon & Omit<IconProps, "fontSize">;

export type TOwnerState = {
  ownerState?: TIcon;
};
