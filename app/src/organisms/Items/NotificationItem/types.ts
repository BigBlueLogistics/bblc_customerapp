import React from "react";
import { MenuItemProps } from "@mui/material/MenuItem";

export type TNotificationItem = {
  icon: React.ReactNode;
  title: string;
} & MenuItemProps;
