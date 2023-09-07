import { TStatus } from "types/status";

export type TWaveChart = {
  data: {
    inboundPerWeek: { [key: string]: { weight: number } } | null;
    outboundPerWeek: { [key: string]: { weight: number } } | null;
    coverageDate: string;
  };
  status: TStatus;
  message: string;
};
