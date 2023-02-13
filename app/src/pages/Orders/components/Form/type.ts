import { IStatus } from "types/status";

export type IFormData = {
  id: string;
  ref_number: string;
  instruction: string;
  allow_notify: boolean;
  source_wh: string;
  requests: {
    id: number;
    search: string;
    material: string;
    description: string;
    qty: string;
    units: string;
    batch: string;
    expiry: string;
    available: string;
  }[];
};

export type IForm = {
  open: boolean;
  onClose: () => void;
  onUpdate: (userId: number, data: { [key: string]: any }) => void;
  data: {
    [key: string]: any;
  };
  isLoadingEdit: boolean;
  isLoadingUpdate: boolean;
  status: IStatus;
  message: string;
  warehouseList: { value: string | number; label: string }[];
};
