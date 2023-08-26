import { TrucksVansStatusEntity } from "entities/trucksVans";

export type IItemStatus = {
  data: TrucksVansStatusEntity;
  noGutter?: boolean;
  onOpenStatusDetails: () => void;
};
