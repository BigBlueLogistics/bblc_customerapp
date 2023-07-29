import { IStatus } from "types/status";

export type TStatistics = {
  data: {
    inboundSum: number;
    outboundSum: number;
    transactionCount: number;
    activeSku: number;
  };
  status: IStatus;
  message: string;
};
