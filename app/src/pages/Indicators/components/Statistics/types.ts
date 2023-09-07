import { TStatus } from "types/status";

export type TStatistics = {
  data: {
    inboundSum: number;
    outboundSum: number;
    transactionCount: number;
    activeSku: number;
  };
  status: TStatus;
  message: string;
};
