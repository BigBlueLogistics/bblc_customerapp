import React from "react";

type RoutesType = Array<{
  type?: "collapse" | "title" | "divider" | "";
  name?: string;
  key?: string;
  icon?: React.ReactNode;
  collapse?: Array<any>;
  href?: string;
  title?: string;
  route: string;
  component: React.ReactNode;
  access: "public" | "protected";
}>;

export default RoutesType;
