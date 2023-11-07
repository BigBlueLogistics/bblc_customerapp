import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class OrdersServices extends HttpAdapter {
  bwmsApiUrl = null;

  constructor(bwmsApiUrl: string) {
    super();
    this.bwmsApiUrl = bwmsApiUrl;
  }

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

  getStatusList() {
    return this.get("/orders/status/list");
  }

  getOutboundDetails(docNo: string) {
    return this.post(
      "/getoutbounddetail",
      { server: "prd", VBELN: docNo },
      {
        baseURL: this.bwmsApiUrl,
        withCredentials: false,
      }
    );
  }

  createOutboundDetails(data: any) {
    return this.post(
      "/tagoutboundprocess",
      { server: "bctp", ...data },
      {
        baseURL: this.bwmsApiUrl,
        withCredentials: false,
      }
    );
  }
}

export default OrdersServices;
