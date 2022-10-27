import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { request, failedRequests, authenticated, apiToken } = useAppSelector(
    (state) => state.auth
  );

  const message = failedRequests[signIn.rejected.type]?.message;
  const status = request[signIn.pending.type]?.status;

  const hasError = status === "failed";
  const isLogging = status === "loading";

  return {
    errorMsg: message,
    hasError,
    isAuthenticated: authenticated,
    apiToken,
    isLogging,
  };
};
