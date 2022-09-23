import axios, { AxiosRequestConfig } from "axios";

class HttpAdapter {
  token: string;

  server: string;

  constructor(server: string, token = "") {
    this.server = server;
    this.token = token;
  }

  get = (url: string, config: AxiosRequestConfig = {}) => {
    const axiosConfig = { ...config, params: { server: this.server, ...config.params } };

    return axios.get(url, axiosConfig);
  };
}

// TODO: retrieve cookies server and token
const http = new HttpAdapter("prd");
const api = {
  get: http.get,
};

export default api;
