import { AxiosError } from "axios";
import { TStatus } from "types/status";
import {
  TrucksVansStatusEntity,
  TrucksVansStatusDetailsEntity,
  TruckVansScheduleTodayEntity,
} from "entities/trucksVans";

export type TListStatus = {
  status: TStatus;
  data: TrucksVansStatusEntity[] | null;
  message: AxiosError | string;
};

export type TListStatusDetails = {
  status: TStatus;
  data: TrucksVansStatusDetailsEntity;
  message: AxiosError | string;
};

export type TListScheduleToday = {
  status: TStatus;
  data: TruckVansScheduleTodayEntity[];
  message: AxiosError | string;
};
