import { TProfile, TProfileChangePass } from "../types";

export default function miscData() {
  const initialStateChangePass: TProfileChangePass = {
    message: "",
    data: null,
    status: "idle",
  };
  const initialStateProfle: TProfile = {
    message: "",
    data: null,
    status: "idle",
  };

  return {
    initialStateChangePass,
    initialStateProfle,
  };
}
