import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { ArrayHelpers, FormikHelpers, FormikProps } from "formik";
import { IOrderData } from "pages/Orders/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IAutoCompleteUnitsData } from "../AutoCompleteUnits/types";

export type IFormTable = {
  materials: IAutoCompleteMaterialData[];
  expiryBatch: { [key: string]: IAutoCompleteExpiryData[] };
  units: { [key: string]: string[] };
  selectedMaterialCodes: { [key: string]: any };
  onMount: (setValues: FormikProps<IOrderData>["setValues"]) => void;
  handleMaterialCode: (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => void;
  handleUnits: (
    value: IAutoCompleteUnitsData,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => void;
  handleExpiryBatch: (
    value: IAutoCompleteExpiryData,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => void;
  handleRemoveRow: (
    remove: ArrayHelpers["remove"],
    setValues: FormikHelpers<IOrderData>["setValues"],
    idx: number,
    uuid: string
  ) => void;
  handleAddRow: (push: ArrayHelpers["push"]) => void;
};
