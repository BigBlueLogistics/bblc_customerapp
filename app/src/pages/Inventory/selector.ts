import { useAppSelector } from "hooks";

export default () => {
  const { customerCode } = useAppSelector((state) => state.auth);

  return { customerCode };
};
