import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { urls } from "config";

type Status = "idle" | "loading" | "success" | "failed";
type Download = {
  url: string;
  filename?: string;
  data?: { [key: string]: any };
};
type Error = AxiosError | null;

function axiosInit() {
  const apiToken = localStorage.getItem("apiToken");

  return axios.create({
    baseURL: urls().apiUrl,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });
}

function useDownloadFile() {
  const [error, setError] = useState<Error>(null);
  const [status, setStatus] = useState<Status>("idle");

  const onDownloadProgress = (event: any) => {
    const percent = Math.round((event.loaded / event.total) * 100);
    if (percent === 100) {
      setStatus("success");
    }
  };

  const downloadFile = async ({ url, filename = "file1", data = {} }: Download) => {
    setStatus("loading");
    setError(null);

    try {
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
      setError(err);
      setStatus("failed");
    }
  };

  return { downloadFile, error, status };
}

export default useDownloadFile;
