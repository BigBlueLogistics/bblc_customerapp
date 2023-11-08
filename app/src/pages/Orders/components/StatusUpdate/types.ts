import { TStatusUpdateData } from "pages/Orders/types";

export type TStatusUpdate = {
  open: boolean;
  onClose: () => void;
  data: TStatusUpdateData;
  onGetOutbound: (docNo: string) => void;
  onCreateOutbound: (docNo: string) => void;
};

export type TStatusDetails = {
  data: TStatusUpdateData;
};
