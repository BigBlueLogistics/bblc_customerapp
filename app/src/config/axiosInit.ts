import axios, { AxiosInstance } from "axios";
import { urls } from "config";

class AxiosInit {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: urls().apiUrl,
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });
  }

  public axios() {
    const token = localStorage.getItem("apiToken");

    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return this.instance;
  }
}

export default AxiosInit;
