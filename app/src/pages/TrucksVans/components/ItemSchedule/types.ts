import { TruckVansScheduleTodayEntity } from "entities/trucksVans";

export type TItemSchedule = {
  data: TruckVansScheduleTodayEntity[];
  noGutter?: boolean;
  darkMode?: boolean;
};
