import { useAppSelector } from "hooks";
import { changePass } from "redux/auth/thunk";

export default () => {
  const { request, failedRequests, successfulRequests } = useAppSelector((state) => state.auth);

  const status = request[changePass.pending.type]?.status;

  const message =
    // eslint-disable-next-line no-nested-ternary
    status === "succeeded"
      ? successfulRequests[changePass.fulfilled.type]?.message
      : status === "failed"
      ? failedRequests[changePass.rejected.type]?.message
      : "";

  return {
    message,
    status,
  };
};
