import { TrucksVansStatusEntity } from "entities/trucksVans";

export type TItemStatus = {
  data: TrucksVansStatusEntity;
  noGutter?: boolean;
  onOpenStatusDetails: () => void;
};
