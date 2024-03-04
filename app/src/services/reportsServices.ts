import { AxiosRequestConfig } from "axios";
import { TValidationSchedule } from "pages/Reports/components/ModalSchedule/validationSchema";
import HttpAdapter from "./httpAdapter";

class ReportsServices extends HttpAdapter {
  getReports(config: AxiosRequestConfig) {
    return this.get("/reports", config);
  }

  updateSchedule(data: TValidationSchedule & { customer_code: string }) {
    return this.post("/reports/schedule-inventory", data);
  }
}

export default ReportsServices;
