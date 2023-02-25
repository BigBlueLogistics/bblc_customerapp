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

  getOrderList(config?: AxiosRequestConfig) {
    return this.get("/orders", config);
  }

  createOrder(data: any) {
    return this.post("/orders/create", data);
  }

  getOrderById(transId: string) {
    return this.get(`/orders/${transId}`);
  }

  updateOrder(transId: string, data: any) {
    return this.post(`/orders/update/${transId}`, data);
  }

  cancelOrder(transId: string) {
    return this.post(`/orders/cancel/${transId}`);
  }
}

export default OrdersServices;
