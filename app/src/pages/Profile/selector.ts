import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { successfulRequests } = useAppSelector((state) => state.auth);

  const {
    fname,
    lname,
    email,
    customer_code: customerCode,
  } = successfulRequests[signIn.fulfilled.type]?.data || {};

  return {
    name: `${fname} ${lname}`,
    email,
    customerCode,
  };
};
