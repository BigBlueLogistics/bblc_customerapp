import { AutocompleteChangeReason } from "@mui/material/Autocomplete";

export type IAutoCompleteExpiryData = {
  id: string;
  batch: string;
  expiry: string;
};

export type IAutoCompleteExpiry = {
  index: number;
  options: IAutoCompleteExpiryData[];
  onChange: (value: IAutoCompleteExpiryData, reason: AutocompleteChangeReason) => void;
  value: string;
};
