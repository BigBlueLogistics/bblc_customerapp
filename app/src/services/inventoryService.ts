import { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpAdapter from "services/httpAdapter";
import { ResponseInventoryEntity } from "entities/inventory";

class InventoryServices extends HttpAdapter {
  getInventoryList(config: AxiosRequestConfig): Promise<AxiosResponse<ResponseInventoryEntity>> {
    return this.get("/inventory", config);
  }

  getWarehouseList() {
    return this.get("/warehouse/list");
  }
}

export default InventoryServices;
