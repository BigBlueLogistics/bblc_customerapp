import { FormikHelpers } from "formik";
import { TFormOrderState, TOrderData } from "pages/Orders/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";

export type IForm = {
  open: boolean;
  onClose: () => void;
  onSave: (data: TOrderData, actions: FormikHelpers<TOrderData>) => void;
  onShowCancelConfirmation: (transid: string) => void;
  data: TFormOrderState;
  warehouseList: { PLANT: string | number; NAME1: string }[];
};

export type IReducerState = {
  materials: IAutoCompleteMaterialData[];
  expiryBatch: { [key: string]: IAutoCompleteExpiryData[] };
  units: { [key: string]: string[] };
};
