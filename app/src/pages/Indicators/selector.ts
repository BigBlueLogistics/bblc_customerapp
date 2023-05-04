import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { successfulRequests } = useAppSelector((state) => state.auth);

  const customerCode = successfulRequests[signIn.fulfilled.type]?.data?.customer_code || null;

  return { customerCode };
};
