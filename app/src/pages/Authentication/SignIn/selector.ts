import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { request, failedRequests, authenticated, apiToken } = useAppSelector(
    (state) => state.auth
  );

  const message = failedRequests[signIn.rejected.type]?.message;

  const hasError = request[signIn.pending.type]?.status === "failed";

  return {
    errorMsg: message,
    hasError,
    isAuthenticated: authenticated,
    apiToken,
  };
};
