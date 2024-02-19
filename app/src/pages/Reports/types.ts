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
export type TReportType = "wh-snapshot" | "aging-report" | "stock-status";
export type TGroupBy = LooseType<TGroupByWhSnapshot | TGroupByAging>;

type FieldFilter = {
  reportType: TReportType;
  warehouse: string;
  groupBy: TGroupBy;
};

export type TFiltered = {
  filtering: FieldFilter;
  filtered: FieldFilter;
};

export type TGroupByKey = "stock" | "aging";
