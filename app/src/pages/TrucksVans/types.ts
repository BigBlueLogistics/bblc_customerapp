import { AxiosError } from "axios";
import { TStatus } from "types/status";
import {
  TrucksVansStatusEntity,
  TrucksVansStatusDetailsEntity,
  TruckVansScheduleTodayEntity,
  TrucksVansSearchEntity,
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

export type TSearchTrucksVans = {
  status: TStatus;
  data: TrucksVansSearchEntity[];
  message: AxiosError | string;
};

export type TNotices = {
  status: TStatus;
  data: { [key: string]: any };
  message: AxiosError | string;
  type: "create" | "delete" | null;
};
