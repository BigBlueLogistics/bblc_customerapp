import { IStatus } from "types/status";

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
};
