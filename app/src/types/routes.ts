import React from "react";

export type RouteParams = {
  type?: "collapse" | "title" | "divider" | "";
  name?: string;
  icon?: React.ReactNode;
  collapse?: Array<any>;
  href?: string;
  title?: string;
  key: string;
  index?: boolean;
  allowedRoles?: Array<string>;
  component?: React.ReactNode;
  route?: string;
  access: "public" | "protected";
};

type RoutesType = Array<RouteParams>;

export default RoutesType;
