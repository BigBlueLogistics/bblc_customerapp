import React from "react";

export type IMDSnackbar = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  icon: React.ReactNode;
  title: string;
  dateTime: string;
  content: React.ReactNode;
  close: () => void;
  bgWhite?: boolean;
};
