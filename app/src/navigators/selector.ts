import { useAppSelector } from "hooks";

export default () => {
  const { authenticated, apiToken } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated: authenticated,
    apiToken,
  };
};
