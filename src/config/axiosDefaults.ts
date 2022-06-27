import axios from "axios";

export default function axiosInstance() {
  // API base url
  axios.defaults.baseURL = "http://localhost:8000/api";
  axios.defaults.timeout = 1000 * 60 * 5; // wait at least 5 mins
}
