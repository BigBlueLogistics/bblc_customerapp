import { TResponse } from "./response";

export type InventoryEntity = {
  materialCode: string;
  description: string;
  initialAllocatedWt: number;
  restrictedWt: number;
  availableWt: number;
  warehouse: string;
  unit: string;
  fixedWt: string;
  availableQty: number;
  allocatedQty: number;
  restrictedQty: number;
  totalQty: number;
  allocatedWt: number;
};

export type ResponseInventoryEntity = TResponse<InventoryEntity[]>;
