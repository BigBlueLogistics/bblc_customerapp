import React from "react";

type IMDAlert = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  dismissible?: boolean;
  children: React.ReactNode;
};

export default IMDAlert;
