import { TrucksVansStatusDetailsEntity } from "entities/trucksVans";
import { TStatus } from "types/status";

export type TStatusDetails = {
  data: TrucksVansStatusDetailsEntity;
  open: boolean;
  onClose: () => void;
  loadingStatus: TStatus;
};
