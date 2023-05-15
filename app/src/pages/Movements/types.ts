import { IStatus } from "types/status";

export type INotifyOrder = {
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
  pickup_date: string | null;
  ref_number: string;
  instruction: string;
  allow_notify: boolean;
  source_wh: string;
  status: string;
  requests: {
    uuid: string;
    material: string;
    description: string;
    qty: string;
    units: string;
    batch: string;
    expiry: string;
    available: string | number;
    created_at?: Date;
  }[];
  requestsDelete?: string[];
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

export type IFormOrderState = {
  id: string;
  type: "create" | "edit" | "update" | "view" | "confirmation" | "cancel";
  status: IStatus;
  data: IOrderData;
  message: string;
  openConfirmation: boolean;
};
