import { FormikHelpers } from "formik";
import { IFormOrderState, IOrderData } from "pages/Orders/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";

export type IForm = {
  open: boolean;
  onClose: () => void;
  onSave: (data: IOrderData, actions: FormikHelpers<IOrderData>) => void;
  data: IFormOrderState;
  isLoadingEdit: boolean;
  isLoadingUpdate: boolean;
  warehouseList: { value: string | number; label: string }[];
};

export type IReducerState = {
  materials: IAutoCompleteMaterialData[];
  expiryBatch: { [key: string]: IAutoCompleteExpiryData[] };
  units: { [key: string]: string[] };
};
