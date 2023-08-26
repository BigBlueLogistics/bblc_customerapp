import { TrucksVansStatusEntity } from "entities/trucksVans";
import { ChangeEvent } from "react";

export type IStatus = {
  data: TrucksVansStatusEntity[];
  searchData: string;
  onOpen: (vanMonitorNo: string) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onOpenSearch: () => void;
};
