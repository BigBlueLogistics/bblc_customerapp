import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { urls } from "config";

class HttpAdapter {
  private token: string;

  private axios: AxiosInstance;

  constructor(token = "") {
    this.token = token;
    this.axios = axios.create({
      baseURL: urls().apiUrl,
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    // TODO
    // this.axios.interceptors.request.use((resolve) =>{
    //   if(["POST", "GET", "PATCH", "DELETE"].includes(resolve.method) && !Cookies.get("XSRF-TOKEN") ){
    //     // TODO request endpint /sanctum/csrf-cookies
    //   }

    //   return resolve;
    // });
  }

  public get(url: string, config: AxiosRequestConfig = {}) {
    const axiosConfig = { ...config, params: { ...config.params } };

    return this.axios.get(url, axiosConfig);
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig) {
    const postData = { ...data };

    return this.axios.post(url, postData, config);
  }
}

export default HttpAdapter;
