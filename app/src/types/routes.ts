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
  route: string;
  component: React.ReactNode;
  access: "public" | "protected";
};

type RoutesType = Array<RouteParams>;

export default RoutesType;
