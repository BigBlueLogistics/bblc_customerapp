import { TResponse } from "./response";

export type IndicatorsStatisticsEntity = {
  inboundSum: number;
  outboundSum: number;
  transactionCount: number;
  activeSku: number;
};

export type IndicatorsWtPalletsEntity = {
  transactions: [number[], number[]];
  transactionsDates: string[];
  coverageDate: string;
};

export type ResponseIndicatorsStatisticsEntity = TResponse<IndicatorsStatisticsEntity>;
export type ResponseIndicatorsWtPalletsEntity = TResponse<IndicatorsWtPalletsEntity>;
