import axios from "axios";

class HttpAdapter {
  token;

  server;

  constructor(server, token = "") {
    this.server = server;
    this.token = token;
  }

  get = (url, config = {}) => {
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
