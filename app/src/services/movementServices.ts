import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class MovementServices extends HttpAdapter {
  getMovements(config: AxiosRequestConfig) {
    return this.get("/movements", config);
  }

  getMaterialDescription(config: AxiosRequestConfig) {
    return this.get("/movements/material-description", config);
  }

  getOutboundSubDetails(config: AxiosRequestConfig) {
    return this.get("/movements/outbound-subdetails", config);
  }
}

export default MovementServices;
