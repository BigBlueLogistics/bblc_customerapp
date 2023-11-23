import { ChangeEvent, MutableRefObject } from "react";
import { TListStatus } from "../../types";

export type TStatus = {
  inputSearchRef: MutableRefObject<any>;
  data: TListStatus;
  searchData: string;
  onOpen: (vanMonitorNo: string, action: "search" | "view") => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onOpenSearch: () => void;
};
