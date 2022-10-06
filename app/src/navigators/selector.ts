import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/thunk";

export default () => {
  const { authenticated, successfulRequests } = useAppSelector((state) => state.auth);

  const token = (successfulRequests && successfulRequests[signIn.fulfilled.type]?.token) || null;
  return {
    isAuthenticated: authenticated,
    token,
  };
};
