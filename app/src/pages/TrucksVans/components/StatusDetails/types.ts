import { TrucksVansStatusDetailsEntity } from "entities/trucksVans";
import { IStatus } from "types/status";

export type IStatusDetails = {
  data: TrucksVansStatusDetailsEntity;
  open: boolean;
  onClose: () => void;
  loadingStatus: IStatus;
};
