import { useAppSelector } from "hooks";

export default () => {
  const { authenticated, apiToken, successfulRequests } = useAppSelector((state) => state.auth);

  const isAuthenticated = authenticated && Object.keys(successfulRequests).length > 0;

  return {
    isAuthenticated,
    apiToken,
  };
};
