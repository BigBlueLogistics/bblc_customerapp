export default () => {
  const environment = process.env.NODE_ENV;

  const apiUrl =
    environment !== "production"
      ? process.env.REACT_APP_API_URL_DEV
      : process.env.REACT_APP_API_URL_PROD;

  return {
    apiUrl,
  };
};
