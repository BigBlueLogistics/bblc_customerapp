import { TStatus } from "types/status";
import { LooseType } from "types/utility";
import { TValidationSchema } from "./components/Form/validationSchema";

export type TNotifyOrder = {
  open: boolean;
  message?: string;
  title?: string;
  color?: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type TGroupByWhSnapshot = "batch" | "expiry" | "material" | "";
export type TGroupByAging = "expiration" | "receiving" | "production" | "";
export type TGroupBy = TGroupByWhSnapshot | TGroupByAging;

export type TOrderData = {
  id: string;
  status: {
    id: number;
    name: string;
  };
  requestsDelete?: string[];
} & TValidationSchema;

export type TFiltered = {
  status: string;
  createdAt: Date | null;
  lastModified: Date | null;
};
export type TTableOrder = {
  status: TStatus;
  data: any;
  message: string;
};

export type TFormOrderState = {
  id: string;
  type: LooseType<"create" | "edit" | "update" | "view" | "confirmation" | "cancel">;
  status: TStatus;
  data: TOrderData;
  message: string;
  openConfirmation: boolean;
};

export type TStatusDetailsData = {
  remarks: string;
  status: string;
  message?: string;
  budat: string;
  bunam: string;
  info?: {
    docNo: string;
    customerCode: string;
    customerName: string;
    createdDate: string;
    createdTime: string;
    createdBy: string;
    requestNum: string;
    soNum: string;
    totalWeight: string;
    warehouse: string;
    date: string;
  };
};

export type TStatusUpdateData = {
  status: TStatus;
  data: TStatusDetailsData;
  message: string;
  action: "edit" | "create" | null;
};
