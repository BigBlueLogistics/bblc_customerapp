import React from "react";
import { IMDButton } from "atoms/MDButton/types";

export type IPagination = {
  item?: boolean;
  variant?: "gradient" | "contained";
  color?:
    | "white"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";
  size?: "small" | "medium" | "large";
  active?: boolean;
  children: React.ReactNode;
};
export type IMDPagination = IPagination & IMDButton;

export type IOwnerState = {
  ownerState?: Pick<IPagination, "variant" | "active"> & {
    paginationSize: IPagination["size"];
  };
};
