import { useAppSelector } from "hooks";

export default () => {
  const { authenticated } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated: authenticated,
  };
};
