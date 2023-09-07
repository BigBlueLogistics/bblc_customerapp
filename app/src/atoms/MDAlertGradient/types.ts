import React from "react";

type TMDAlert = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  dismissible?: boolean;
  children: React.ReactNode;
};

export type TOwnerState = {
  ownerState?: {
    color: TMDAlert["color"];
  };
};

export default TMDAlert;
