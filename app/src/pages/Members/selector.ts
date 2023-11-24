import { useAppSelector } from "hooks";
import { signIn } from "redux/auth/action";

export default () => {
  const { successfulRequests } = useAppSelector((state) => state.auth);

  const { id } = successfulRequests[signIn.fulfilled.type]?.data || {};

  return { loggedUserId: id };
};
