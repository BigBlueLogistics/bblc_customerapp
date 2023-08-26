import { IconProps } from "@mui/material";
import { LooseType } from "types/utility";

export type IIcon = {
  fontSize?: LooseType<IconProps["fontSize"]> | number;
};

export type IMDIcon = IIcon & Omit<IconProps, "fontSize">;

export type IOwnerState = {
  ownerState?: IIcon;
};
