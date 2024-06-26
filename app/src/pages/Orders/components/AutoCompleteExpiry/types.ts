import { AutocompleteChangeReason } from "@mui/material/Autocomplete";

export type IAutoCompleteExpiryData = {
  id: string;
  batch: string;
  expiry: string;
  quantity?: number;
};

export type IAutoCompleteExpiry = {
  index: number;
  error?: boolean;
  helperText?: string;
  options: IAutoCompleteExpiryData[];
  onChange: (value: IAutoCompleteExpiryData, reason: AutocompleteChangeReason) => void;
  value: string;
};
