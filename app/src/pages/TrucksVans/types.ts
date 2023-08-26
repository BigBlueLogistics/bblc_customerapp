import { AxiosError } from "axios";
import { IStatus } from "types/status";
import { TrucksVansStatusEntity, TrucksVansStatusDetailsEntity } from "entities/trucksVans";

export type IListStatus = {
  status: IStatus;
  data: TrucksVansStatusEntity[] | null;
  message: AxiosError | string;
};

export type IListStatusDetails = {
  status: IStatus;
  data: TrucksVansStatusDetailsEntity;
  message: AxiosError | string;
};
