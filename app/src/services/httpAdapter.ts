import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

class HttpAdapter {
  private token: string;

  private server: string;

  private axios: AxiosInstance;

  constructor(server: string, token = "") {
    this.server = server;
    this.token = token;
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });
  }

  public get(url: string, config?: AxiosRequestConfig) {
    const axiosConfig = { ...config, params: { server: this.server, ...config.params } };

    return this.axios.get(url, axiosConfig);
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig) {
    const postData = { ...data, server: this.server };

    return this.axios.post(url, postData, config);
  }
}

export default HttpAdapter;
