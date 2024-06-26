import { TFormOrderState } from "../types";

export type TData = {
  onShowEdit: (transid: string, type: TFormOrderState["type"]) => void;
  onShowCancelConfirmation: (transid: string) => void;
};

export type TAttachmentStatus = {
  upload: File[] | null;
  uploaded: string[] | null;
  delete: string[] | null;
};
