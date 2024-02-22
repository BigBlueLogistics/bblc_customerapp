import files from "./files";

function urls() {
  const API_URL_DEV = "http://localhost:16692/api";
  const API_URL_PROD = "https://bigbluecoldstorage.com/public/api";
  const DOWNLOADABLE_URL_DEV = "http://localhost:16692/download";
  const DOWNLOADABLE_URL_PROD = "https://bigbluecoldstorage.com/public/download";

  const environment = process.env.NODE_ENV;
  const isDev = environment !== "production";

  const apiUrl = isDev ? API_URL_DEV : API_URL_PROD;
  const downloadableUrl = isDev ? DOWNLOADABLE_URL_DEV : DOWNLOADABLE_URL_PROD;

  return {
    API_URL: apiUrl,
    TEMPLATE_ORDER_FORM_URL: `${downloadableUrl}/${files().TEMPLATE_ORDER_FORM}`,
  };
}

export default urls;
