import { ChangeEvent } from "react";
import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { TrucksVansSearchEntity } from "entities/trucksVans";

export type IAutoCompleteSearchData = TrucksVansSearchEntity;

export type IAutoCompleteSearch = {
  isLoading?: boolean;
  options: IAutoCompleteSearchData[];
  value: string;
  onInputSearch: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
  onSelectSearch: (value: IAutoCompleteSearchData, reason: AutocompleteChangeReason) => void;
};
