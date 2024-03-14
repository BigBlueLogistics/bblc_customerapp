import { AutocompleteChangeReason } from "@mui/material";
import { ChangeEvent } from "react";
import { TListStatus, TSearchTrucksVans } from "../../types";
import { IAutoCompleteSearchData } from "./AutoCompleteSearch/types";

export type TStatus = {
  searchResult: TSearchTrucksVans;
  data: TListStatus;
  searchTerm: string;
  onOpen: (vanMonitorNo: string, action: "search" | "view") => void;
  onInputSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectSearch: (value: IAutoCompleteSearchData, reason: AutocompleteChangeReason) => void;
};
