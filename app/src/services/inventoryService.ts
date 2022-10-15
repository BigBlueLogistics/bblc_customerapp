import { AxiosRequestConfig } from "axios";
import HttpAdapter from "services/httpAdapter";

class InventoryServices extends HttpAdapter {
  constructor(token = "") {
    super(token);
  }

  getTableData(config: AxiosRequestConfig) {
    return this.get("/inventory/table", config);
  }

  getWarehouseList() {
    return this.get("/inventory/warehouse-list");
  }
}

export default InventoryServices;
