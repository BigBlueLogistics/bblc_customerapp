import { AxiosRequestConfig } from "axios";
import { axiosInit } from "config";

class HttpAdapter extends axiosInit {
  public get(url: string, config: AxiosRequestConfig = {}) {
    const axiosConfig = { ...config, params: { ...config.params } };

    return this.axios().get(url, axiosConfig);
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig) {
    const postData = { ...data };

    return this.axios().post(url, postData, config);
  }

  public delete(url: string, config: AxiosRequestConfig = {}) {
    return this.axios().delete(url, config);
  }
}

export default HttpAdapter;
