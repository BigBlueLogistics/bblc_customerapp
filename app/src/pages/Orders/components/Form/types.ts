import { MutableRefObject } from "react";
import { FormikHelpers } from "formik";
import { TFormOrderState, TOrderData, TUploadFormOrderState } from "pages/Orders/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";

export type IForm = {
  open: boolean;
  onClose: () => void;
  onSave: (
    data: TOrderData & { customer_code: string },
    actions: FormikHelpers<TOrderData>
  ) => void;
  onUploadFile: (
    fileData: Pick<TOrderData, "attachment" | "attachmentDelete"> & { customer_code: string }
  ) => void;
  inputFileRef: MutableRefObject<HTMLInputElement>;
  onShowCancelConfirmation: (transid: string) => void;
  data: TFormOrderState;
  fileUploadedData: TUploadFormOrderState;
  warehouseList: { PLANT: string | number; NAME1: string }[];
};

export type IReducerState = {
  materials: IAutoCompleteMaterialData[];
  expiryBatch: { [key: string]: IAutoCompleteExpiryData[] };
  units: { [key: string]: string[] };
};
