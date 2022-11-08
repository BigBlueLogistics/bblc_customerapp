import { ChangePassType } from "types/authForm";

export type IChangePassword = {
  title: string;
  isLoading: boolean;
  onChangePass: (values: ChangePassType) => void;
  shadow?: boolean;
};
