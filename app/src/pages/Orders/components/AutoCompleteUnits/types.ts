import { AutocompleteChangeReason } from "@mui/material/Autocomplete";

export type IAutoCompleteUnitsData = string;

export type IAutoCompleteUnits = {
  index: number;
  error?: boolean;
  helperText?: string;
  options: IAutoCompleteUnitsData[];
  optionsDisabled: string[];
  onChange: (value: IAutoCompleteUnitsData, reason: AutocompleteChangeReason) => void;
  value: string;
};
