import React from "react";

type RoutesType = Array<{
  type?: "collapse" | "title" | "divider" | "";
  name?: string;
  icon?: React.ReactNode;
  collapse?: Array<any>;
  href?: string;
  title?: string;
  key: string;
  index?: boolean;
  route: string;
  component: React.ReactNode;
  access: "public" | "protected";
}>;

export default RoutesType;
