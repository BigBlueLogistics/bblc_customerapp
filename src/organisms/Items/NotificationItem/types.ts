import React from "react";
import { MenuItemProps } from "@mui/material/MenuItem";

export type INotificationItem = {
  icon: React.ReactNode;
  title: string;
} & MenuItemProps;
