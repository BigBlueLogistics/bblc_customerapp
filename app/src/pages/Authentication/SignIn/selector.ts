import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/thunk";

export default () => {
  const { request, failedRequests } = useAppSelector((state) => state.auth);

  const message = failedRequests[signIn.rejected.type]?.message;

  const hasError = request[signIn.pending.type]?.status === "failed";

  return {
    errorMsg: message,
    hasError,
  };
};
