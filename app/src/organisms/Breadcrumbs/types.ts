import React from "react";

export type IBreadcrumbs = {
  icon: React.ReactNode;
  title: string;
  route: any[];
  light?: boolean;
};
