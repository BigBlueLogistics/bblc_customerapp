import axios, { AxiosInstance } from "axios";
import { urls } from "config";

class AxiosInit {
  private instance: AxiosInstance;

  constructor() {
    const init = axios.create({
      baseURL: urls().apiUrl,
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    // intercept api response
    init.interceptors.response.use(
      (success) => {
        return success;
      },
      (err) => {
        // Use api message if exists.
        const error = { ...err };
        if (error?.response?.data?.message) {
          error.message = error.response.data.message;
        }

        return Promise.reject(error);
      }
    );

    this.instance = init;
  }

  public axios() {
    const token = localStorage.getItem("apiToken");

    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return this.instance;
  }
}

export default AxiosInit;
