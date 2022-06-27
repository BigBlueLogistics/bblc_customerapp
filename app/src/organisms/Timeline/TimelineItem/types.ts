import React from "react";

export type ITimelineItem = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  icon: React.ReactNode;
  title: string;
  dateTime: string;
  description?: string;
  lastItem?: boolean;
};
