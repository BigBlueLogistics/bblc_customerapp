import { TResponse } from "./response";

export type IndicatorsStatisticsEntity = {
  inboundSum: number;
  outboundSum: number;
  transactionCount: number;
  activeSku: number;
};

export type IndicatorsWtPalletsEntity = {
  transactionsDates: string[];
  byWeight: [number[], number[]];
  byPalletCount: [number[], number[]];
};

export type ResponseIndicatorsStatisticsEntity = TResponse<IndicatorsStatisticsEntity>;
export type ResponseIndicatorsWtPalletsEntity = TResponse<IndicatorsWtPalletsEntity>;
