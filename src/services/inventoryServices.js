import api from "services/httpAdapter";

export default class inventoryServices {
  static getTableData(config) {
    return api.get("/inventory/table", config);
  }

  static getWarehouseList() {
    return api.get("/inventory/warehouse-list");
  }
}
