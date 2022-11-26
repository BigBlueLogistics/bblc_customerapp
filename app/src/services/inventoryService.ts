import { AxiosRequestConfig } from "axios";
import HttpAdapter from "services/httpAdapter";

class InventoryServices extends HttpAdapter {
  getInventoryList(config: AxiosRequestConfig) {
    return this.get("/inventory", config);
  }

  getWarehouseList() {
    return this.get("/warehouse/list");
  }
}

export default InventoryServices;
