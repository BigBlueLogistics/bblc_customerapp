import { TResponse } from "./response";

type IndicatorsStatistics = {
  inboundSum: number;
  outboundSum: number;
  transactionCount: number;
  activeSku: number;
};

export type IndicatorsStatisticsEntity = {
  today: IndicatorsStatistics;
  yesterday: IndicatorsStatistics;
};

export type IndicatorsInboundOutboundEntity = {
  byWeight: {
    dates: string[];
    weight: [number[], number[]];
  };
  byTransactions: {
    dates: string[];
    counts: [number[], number[]];
  };
};

export type ResponseIndicatorsStatisticsEntity = TResponse<IndicatorsStatisticsEntity>;
export type ResponseIndicatorsInboundOutboundEntity = TResponse<IndicatorsInboundOutboundEntity>;
