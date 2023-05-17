import { IStatus } from "types/status";

export type INotifyDownload = {
  key: string | number;
  open: boolean;
  message: string;
  title: string;
  autoHideDuration?: number | null;
  color: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type IFiltered = {
  warehouseNo: string;
  type: string;
  materialCode: string;
  coverageDate: [Date, Date];
  status: string;
  createdAt: Date | null;
  lastModified: Date | null;
};

export type ITableOrder = {
  status: IStatus;
  data: any;
  message: string;
};
