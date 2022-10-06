import { useAppSelector } from "hooks";
import { signUp } from "redux/auth/thunk";

export default () => {
  const { request, failedRequests, successfulRequests } = useAppSelector((state) => state.auth);

  const status = request[signUp.pending.type]?.status;

  const message =
    // eslint-disable-next-line no-nested-ternary
    status === "succeeded"
      ? successfulRequests[signUp.fulfilled.type]?.message
      : status === "failed"
      ? failedRequests[signUp.rejected.type]?.message
      : "";

  return {
    message,
    status,
  };
};
