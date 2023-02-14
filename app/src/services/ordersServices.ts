import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class OrdersServices extends HttpAdapter {
  getMaterialDescription(config: AxiosRequestConfig) {
    return this.get("/orders/material-description", config);
  }

  getUnits(config: AxiosRequestConfig) {
    return this.get("/orders/product-units", config);
  }

  getExpiryBatch(config: AxiosRequestConfig) {
    return this.get("/orders/expiry-batch", config);
  }
}

export default OrdersServices;
