import { useAppSelector } from "hooks";
import { resetPass } from "redux/auth/thunk";

export default () => {
  const { request, failedRequests, succeededRequests } = useAppSelector((state) => state.auth);

  const status = request[resetPass.pending.type]?.status;

  const message =
    // eslint-disable-next-line no-nested-ternary
    status === "succeeded"
      ? succeededRequests[resetPass.fulfilled.type]?.message
      : status === "failed"
      ? failedRequests[resetPass.rejected.type]?.message
      : "";

  return {
    message,
    status,
  };
};
