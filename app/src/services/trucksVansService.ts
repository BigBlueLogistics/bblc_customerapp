import {
  ResponseTrucksVansStatusEntity,
  ResponseTrucksVansStatusDetailsEntity,
} from "entities/trucksVans";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpAdapter from "./httpAdapter";

class TrucksVansServices extends HttpAdapter {
  getStatus(): Promise<AxiosResponse<ResponseTrucksVansStatusEntity>> {
    return this.get("/trucks-vans/status");
  }

  getStatusDetails(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<ResponseTrucksVansStatusDetailsEntity>> {
    return this.get("/trucks-vans/status-details", config);
  }
}

export default TrucksVansServices;
