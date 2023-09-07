import React from "react";
import { TMDButton } from "atoms/MDButton/types";

export type TPagination = {
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
export type TMDPagination = TPagination & TMDButton;

export type TOwnerState = {
  ownerState?: Pick<TPagination, "variant" | "active"> & {
    paginationSize: TPagination["size"];
  };
};
