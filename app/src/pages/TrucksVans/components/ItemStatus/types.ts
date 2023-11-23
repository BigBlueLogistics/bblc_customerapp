import { TrucksVansStatusEntity } from "entities/trucksVans";

export type TItemStatus = {
  data: TrucksVansStatusEntity[];
  noGutter?: boolean;
  darkMode?: boolean;
  onOpenStatusDetails: (vmrno: string, action: "view" | "search") => void;
};
