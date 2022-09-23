import axios from "axios";

export default function axiosInstance() {
  // API base url
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.timeout = 1000 * 60 * 5; // wait at least 5 mins
}
