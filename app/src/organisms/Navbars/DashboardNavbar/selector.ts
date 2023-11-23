import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { successfulRequests, customerCode } = useAppSelector((state) => state.auth);

  const { fname, lname, companies } = successfulRequests[signIn.fulfilled.type]?.data || {};

  return {
    name: `${fname} ${lname}`,
    customerCode,
    companies,
  };
};
