import React from "react";

export type TBreadcrumbs = {
  icon: React.ReactNode;
  title: string;
  route: any[];
  light?: boolean;
};
