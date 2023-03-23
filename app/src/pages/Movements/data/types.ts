import { IFormOrderState } from "../types";

export type IData = {
  onShowEdit: (transid: string, type: IFormOrderState["type"]) => void;
  onShowCancelConfirmation: (transid: string) => void;
};
