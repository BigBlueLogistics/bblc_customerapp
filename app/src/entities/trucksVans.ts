import { TResponse } from "./response";

export type TrucksVansStatusEntity = {
  vanno: string;
  vmrno: string;
  type: string;
  size: string;
  location: string;
  pluggedstatus: string;
  arrivaldate: string;
  whdate: string;
  currentstatus: string;
  arrivalstatus: string;
  whschedule: string;
};

export type TrucksVansStatusDetailsEntity = Omit<
  TrucksVansStatusEntity,
  "pluggedstatus" | "whdate" | "whschedule" | "location"
> & {
  arrivalsealno: string;
  arrivaldeliveryno: string;
  arrivaltime: string;
  forwarder: string;
  outdate: string;
  outtime: string;
  outsealno: string;
  outdeliveryno: string;
  outstatus: string;
  whschedule: string;
  whprocessstartdate: string;
  whprocessstarttime: string;
  whprocessend: string;
  plugin: {
    id: number;
    startdate: string;
    starttime: string;
    enddate: string;
    endtime: string;
    totalplughrs: number;
  }[];
};

export type TruckVansScheduleTodayEntity = {
  id: number;
  vehiclenum: string;
  arrivaldate: string;
  arrivaltime: string;
  vehicletype: string;
};

export type TrucksVansSearchEntity = {
  id: string;
  vmrno: string;
  vanno: string;
};

export type ResponseTrucksVansStatusEntity = TResponse<TrucksVansStatusEntity[]>;
export type ResponseTrucksVansStatusDetailsEntity = TResponse<TrucksVansStatusDetailsEntity>;
export type ResponseTrucksVansScheduleTodayEntity = TResponse<TruckVansScheduleTodayEntity[]>;
export type ResponseTrucksVansSearchEntity = TResponse<TrucksVansSearchEntity[]>;
