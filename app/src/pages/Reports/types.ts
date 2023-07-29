import { LooseType } from "types/utility";

export type INotifyDownload = {
  key: string | number;
  open: boolean;
  message: string;
  title: string;
  autoHideDuration?: number | null;
  color: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type IGroupByWhSnapshot = "batch" | "expiry" | "material";
export type IGroupByAging = "expiration" | "receiving" | "production";
export type IGroupBy = LooseType<IGroupByWhSnapshot | IGroupByAging>;
