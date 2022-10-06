import { AxiosRequestConfig } from "axios";
import HttpAdapter from "services/httpAdapter";

class InventoryServices extends HttpAdapter {
  constructor() {
    super("");
  }

  getTableData(config: AxiosRequestConfig) {
    return this.get("/inventory/table", config);
  }

  getWarehouseList() {
    return this.get("/inventory/warehouse-list");
  }
}

const inventory = new InventoryServices();
export default inventory;
