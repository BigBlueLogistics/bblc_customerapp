import { ChangePassType } from "types/authForm";

export type TChangePassword = {
  title: string;
  isLoading: boolean;
  onChangePass: (values: ChangePassType) => void;
  shadow?: boolean;
};
