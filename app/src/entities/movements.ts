import { TResponse } from "./response";

export type SubMovementsEntity = {
  header: string;
  reference: string;
};

export type MovementsEntity = {
  date: string;
  materialCode: string;
  documentNo: number;
  movementType: "INBOUND" | "OUTBOUND";
  description: string;
  batch: number;
  expiration: string;
  quantity: number;
  unit: string;
  weight: number;
  headerText: string;
  reference: string;
  warehouse: string;
  subRows?: SubMovementsEntity[];
};

export type ResponseMovementsEntity = TResponse<MovementsEntity[]>;
export type ResponseSubMovementsEntity = TResponse<SubMovementsEntity>;
