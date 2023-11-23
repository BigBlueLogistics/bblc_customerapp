import React from "react";

export type RouteParams = {
  type?: "collapse" | "title" | "divider" | "";
  name?: string;
  icon?: React.ReactNode;
  collapse?: any[];
  href?: string;
  title?: string;
  key: string;
  index?: boolean;
  allowedRoles?: string[];
  component?: React.ReactNode;
  route?: string;
  access: "public" | "protected";
};

type RoutesType = RouteParams[];

export default RoutesType;
