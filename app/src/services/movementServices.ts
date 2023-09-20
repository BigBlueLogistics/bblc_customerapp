import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ResponseMovementsEntity, ResponseSubMovementsEntity } from "entities/movements";
import HttpAdapter from "./httpAdapter";

class MovementServices extends HttpAdapter {
  getMovements(config: AxiosRequestConfig): Promise<AxiosResponse<ResponseMovementsEntity>> {
    return this.get("/movements", config);
  }

  getMaterialDescription(config: AxiosRequestConfig) {
    return this.get("/movements/material-description", config);
  }

  getOutboundSubDetails(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<ResponseSubMovementsEntity>> {
    return this.get("/movements/outbound-subdetails", config);
  }
}

export default MovementServices;
