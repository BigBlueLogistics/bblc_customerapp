import { LooseType } from "types/utility";
import { TStatus } from "types/status";

export type TTableReports = {
  status: TStatus;
  data: Record<string, any>[];
  message: string;
};

export type INotifyDownload = {
  key: string | number;
  open: boolean;
  message: string;
  title: string;
  autoHideDuration?: number | null;
  color: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type TGroupByWhSnapshot = "batch" | "expiry" | "material";
export type TGroupByAging = "expiration" | "receiving" | "production";
export type TGroupBy = LooseType<TGroupByWhSnapshot | TGroupByAging>;
