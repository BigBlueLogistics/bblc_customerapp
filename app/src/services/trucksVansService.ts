import {
  ResponseTrucksVansStatusEntity,
  ResponseTrucksVansStatusDetailsEntity,
  ResponseTrucksVansScheduleTodayEntity,
} from "entities/trucksVans";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { TValidationNotices } from "pages/TrucksVans/components/ModalMaintainNotices/validationSchema";
import HttpAdapter from "./httpAdapter";

class TrucksVansServices extends HttpAdapter {
  getStatus(config: AxiosRequestConfig): Promise<AxiosResponse<ResponseTrucksVansStatusEntity>> {
    return this.get("/trucks-vans/status", config);
  }

  getStatusDetails(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<ResponseTrucksVansStatusDetailsEntity>> {
    return this.get("/trucks-vans/status-details", config);
  }

  getScheduleToday(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<ResponseTrucksVansScheduleTodayEntity>> {
    return this.get("/trucks-vans/schedule-today", config);
  }

  createNotices(data: TValidationNotices & { customerCode: string }) {
    return this.post("/trucks-vans/create/notices", data);
  }

  deleteNotices(config: AxiosRequestConfig) {
    return this.delete("/trucks-vans/delete/notices", config);
  }
}

export default TrucksVansServices;
