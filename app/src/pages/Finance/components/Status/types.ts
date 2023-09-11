import { TrucksVansStatusEntity } from "entities/trucksVans";
import { ChangeEvent, MutableRefObject } from "react";

export type TStatus = {
  inputSearchRef: MutableRefObject<any>;
  data: TrucksVansStatusEntity[];
  searchData: string;
  onOpen: (vanMonitorNo: string, action: "search" | "view") => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onOpenSearch: () => void;
};
