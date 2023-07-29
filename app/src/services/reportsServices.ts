import { AxiosRequestConfig } from "axios";
import HttpAdapter from "./httpAdapter";

class ReportsServices extends HttpAdapter {
  getReports(config: AxiosRequestConfig) {
    return this.get("/reports", config);
  }
}

export default ReportsServices;
