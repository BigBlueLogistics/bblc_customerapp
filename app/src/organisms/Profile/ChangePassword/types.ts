import { ChangePassType } from "types/authForm";

export type IChangePassword = {
  title: string;
  onChangePass: (values: ChangePassType) => void;
  shadow?: boolean;
};
