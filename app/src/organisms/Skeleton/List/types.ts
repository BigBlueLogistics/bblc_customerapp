import { SkeletonProps, SxProps } from "@mui/material";
import { ElementType } from "react";

export type TItem = {
  darkMode?: boolean;
  noOfItems?: number;
  component?: ElementType;
  containerStyle?: SxProps;
} & SkeletonProps;

export type TOwnerState = {
  ownerState?: {
    darkMode?: boolean;
  };
};
