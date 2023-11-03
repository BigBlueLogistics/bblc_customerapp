import { ChangePassType } from "types/authForm";
import { ResponseProfileChangePassEntity } from "entities/profile";

export type TChangePassword = {
  data: ResponseProfileChangePassEntity;
  title: string;
  onChangePass: (values: ChangePassType) => void;
  shadow?: boolean;
};
