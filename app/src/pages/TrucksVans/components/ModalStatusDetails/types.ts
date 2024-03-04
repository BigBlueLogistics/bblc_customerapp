import { TrucksVansStatusDetailsEntity } from "entities/trucksVans";
import { TStatus } from "types/status";

export type TModalStatusDetails = {
  data: TrucksVansStatusDetailsEntity;
  open: boolean;
  onClose: () => void;
  loadingStatus: TStatus;
};
