import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { ArrayHelpers, FormikHelpers } from "formik";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IFormData } from "../Form/type";

export type IFormTable = {
  materials: IAutoCompleteMaterialData[];
  batchExpiry: IAutoCompleteExpiryData[];
  units: { [key: string]: string[] };
  handleMaterialCode: (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    id: number,
    index: number,
    setValues: FormikHelpers<IFormData>["setValues"]
  ) => void;
  handleExpiryBatch: (
    value: IAutoCompleteExpiryData,
    reason: AutocompleteChangeReason,
    index: number,
    setValues: FormikHelpers<IFormData>["setValues"]
  ) => void;
  handleRemoveRow: (remove: ArrayHelpers["remove"], idx: number, id: number) => void;
  handleAddRow: (push: ArrayHelpers["push"]) => void;
};
