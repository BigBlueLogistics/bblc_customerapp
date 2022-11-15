import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { successfulRequests } = useAppSelector((state) => state.auth);

  const { role_name: accountRole } = successfulRequests[signIn.fulfilled.type]?.data || {};

  return {
    accountRole,
  };
};
