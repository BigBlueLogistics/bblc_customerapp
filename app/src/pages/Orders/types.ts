import { IStatus } from "types/status";

export type INotifyDownload = {
  open: boolean;
  message?: string;
  title?: string;
  color?: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type IGroupByWhSnapshot = "batch" | "expiry" | "material" | "";
export type IGroupByAging = "expiration" | "receiving" | "production" | "";
export type IGroupBy = IGroupByWhSnapshot | IGroupByAging;

export type IOrderData = {
  id: string;
  pickup_date: Date | null;
  ref_number: string;
  instruction: string;
  allow_notify: boolean;
  source_wh: string;
  requests: {
    uuid: string;
    material: string;
    description: string;
    qty: string;
    units: string;
    batch: string;
    expiry: string;
    available: string;
  }[];
};

export type ITableOrder = {
  status: IStatus;
  data: any;
  message: string;
};

export type IFormOrderState = {
  type: "add" | "edit" | "update";
  status: IStatus;
  data: IOrderData;
  message: string;
};
