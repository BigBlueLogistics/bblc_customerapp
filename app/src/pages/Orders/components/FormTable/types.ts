import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { ArrayHelpers, FormikHelpers, FormikProps } from "formik";
import { IOrderData } from "pages/Orders/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";

export type IFormTable = {
  materials: IAutoCompleteMaterialData[];
  expiryBatch: { [key: string]: IAutoCompleteExpiryData[] };
  units: { [key: string]: string[] };
  onMount: (setValues: FormikProps<IOrderData>["setValues"]) => void;
  handleMaterialCode: (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    id: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => void;
  handleExpiryBatch: (
    value: IAutoCompleteExpiryData,
    reason: AutocompleteChangeReason,
    id: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => void;
  handleRemoveRow: (remove: ArrayHelpers["remove"], idx: number, id: string) => void;
  handleAddRow: (push: ArrayHelpers["push"]) => void;
};
