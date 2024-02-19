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
    return this.post("/orders/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getOrderById(transId: string) {
    return this.get(`/orders/${transId}`);
  }

  updateOrder(transId: string, data: any) {
    return this.post(`/orders/update/${transId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  cancelOrder(transId: string) {
    return this.post(`/orders/cancel/${transId}`);
  }

  getStatusList() {
    return this.get("/orders/status/list");
  }

  getAdhocOutbound(data: any) {
    return this.get("/orders/adhoc-outbound-details", { params: data });
  }

  createOutboundDetails(data: any) {
    return this.post("/orders/create-adhoc", data);
  }
}

export default OrdersServices;
