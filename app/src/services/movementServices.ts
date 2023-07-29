import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class MovementServices extends HttpAdapter {
  getMovements(config: AxiosRequestConfig) {
    return this.get("/movements", config);
  }

  getMaterialDescription(config: AxiosRequestConfig) {
    return this.get("/movements/material-description", config);
  }
}

export default MovementServices;
