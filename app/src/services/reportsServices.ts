import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class ReportsServices extends HttpAdapter {
  getReports(config: AxiosRequestConfig) {
    return this.get("/reports", config);
  }

  updateSchedule(data: any) {
    return this.post("/reports/schedule-inventory", data);
  }
}

export default ReportsServices;
