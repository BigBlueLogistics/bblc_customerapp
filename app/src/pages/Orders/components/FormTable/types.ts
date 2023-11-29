import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { ArrayHelpers, FormikHelpers, FormikProps } from "formik";
import { TOrderData } from "pages/Orders/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IAutoCompleteUnitsData } from "../AutoCompleteUnits/types";

export type IFormTable = {
  materials: IAutoCompleteMaterialData[];
  expiryBatch: { [key: string]: IAutoCompleteExpiryData[] };
  units: { [key: string]: string[] };
  selectedRowValues: { [key: string]: string[] };
  onMount: (setValues: FormikProps<TOrderData>["setValues"]) => void;
  handleMaterialCode: (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<TOrderData>["setValues"]
  ) => void;
  handleUnits: (
    value: IAutoCompleteUnitsData,
    prevUnit: string,
    valueMaterial: string,
    reason: AutocompleteChangeReason,
    index: number,
    setValues: FormikHelpers<TOrderData>["setValues"]
  ) => void;
  handleExpiryBatch: (
    value: IAutoCompleteExpiryData & Partial<{ materialCode: string }>,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<TOrderData>["setValues"]
  ) => void;
  handleRemoveRow: (
    remove: ArrayHelpers["remove"],
    setValues: FormikHelpers<TOrderData>["setValues"],
    idx: number,
    uuid: string,
    material: string,
    unit: string
  ) => void;
  handleAddRow: (push: ArrayHelpers["push"]) => void;
};
