import { ResponseMovementsEntity } from "entities/movements";

export type INotifyDownload = {
  key: string | number;
  open: boolean;
  message: string;
  title: string;
  autoHideDuration?: number | null;
  color: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type TFiltered = {
  warehouseNo: string;
  type: string;
  materialCode: string;
  coverageDate: [Date, Date];
  status: string;
  createdAt: Date | null;
  lastModified: Date | null;
};

export type TTableMovements = ResponseMovementsEntity;

export type ITableHeader = {
  onUpdateSubRow?: (row: Record<string, any>) => Promise<void>;
};
