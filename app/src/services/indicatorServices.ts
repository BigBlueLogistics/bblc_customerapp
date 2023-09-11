import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ResponseIndicatorsStatisticsEntity,
  ResponseIndicatorsWtPalletsEntity,
} from "entities/indicators";
import HttpAdapter from "./httpAdapter";

class IndicatorServices extends HttpAdapter {
  getActiveSku(config: AxiosRequestConfig<AxiosResponse<ResponseIndicatorsStatisticsEntity>>) {
    return this.get("/indicators/active-sku", config);
  }

  getInOutbound(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<ResponseIndicatorsWtPalletsEntity>> {
    return this.get("/indicators/in-out-bound", config);
  }
}

export default IndicatorServices;
