import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class MovementServices extends HttpAdapter {
  getMovements(config: AxiosRequestConfig) {
    return this.get("/movements", config);
  }
}

export default MovementServices;
