export type INotifyDownload = {
  open: boolean;
  message?: string;
  title?: string;
  color?: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type IGroupByWhSnapshot = "batch" | "expiry" | "material" | "";
export type IGroupByAging = "expiration" | "receiving" | "production" | "";
export type IGroupBy = IGroupByWhSnapshot | IGroupByAging;
