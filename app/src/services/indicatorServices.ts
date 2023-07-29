import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class IndicatorServices extends HttpAdapter {
  getActiveSku(config: AxiosRequestConfig) {
    return this.get("/indicators/active-sku", config);
  }

  getInOutbound(config: AxiosRequestConfig) {
    return this.get("/indicators/in-out-bound", config);
  }
}

export default IndicatorServices;
