import { useAppSelector } from "hooks";
import { resetPassLink } from "redux/auth/action";

export default () => {
  const { request, failedRequests, successfulRequests } = useAppSelector((state) => state.auth);

  const status = request[resetPassLink.pending.type]?.status;

  const message =
    // eslint-disable-next-line no-nested-ternary
    status === "succeeded"
      ? successfulRequests[resetPassLink.fulfilled.type]?.message
      : status === "failed"
      ? failedRequests[resetPassLink.rejected.type]?.message
      : "";

  const isResetting = status === "loading";

  return {
    message,
    status,
    isResetting,
  };
};
