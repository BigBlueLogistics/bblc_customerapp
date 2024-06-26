import { AutocompleteChangeReason } from "@mui/material/Autocomplete";

export type IAutoCompleteMaterialData = {
  id: string;
  material: string;
  description: string;
};

export type IAutoCompleteMaterial = {
  index: number;
  error?: boolean;
  helperText?: string;
  options: IAutoCompleteMaterialData[];
  onChange: (value: IAutoCompleteMaterialData, reason: AutocompleteChangeReason) => void;
  value: string;
};
