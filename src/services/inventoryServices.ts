import { AxiosRequestConfig } from "axios";
import api from "services/httpAdapter";

export default class InventoryServices {
  static getTableData(config: AxiosRequestConfig) {
    return api.get("/inventory/table", config);
  }

  static getWarehouseList() {
    return api.get("/inventory/warehouse-list");
  }
}
