import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

type Status = "idle" | "loading" | "done";
type Download = {
  url: string;
  filename?: string;
  data?: { [key: string]: any };
};
type Error = AxiosError | null;

function axiosInit() {
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
      Accept: "application/json",
    },
  });
}

function useDownloadFile() {
  const [error, setError] = useState<Error>(null);
  const [status, setStatus] = useState<Status>("idle");
  const onError = (err: any) => {
    setError(err);
  };
  const onDownloadProgress = (event: any) => {
    const percent = Math.round((event.loaded / event.total) * 100);
    if (percent === 100) {
      setStatus("done");
    }
  };

  const downloadFile = async ({ url, filename = "file1", data = {} }: Download) => {
    try {
      setStatus("loading");

      const config: AxiosRequestConfig = { params: data, onDownloadProgress, responseType: "blob" };

      const response = await axiosInit().get(url, config);
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `${filename}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      onError(err);
    }
  };

  return { downloadFile, error, status };
}

export default useDownloadFile;
