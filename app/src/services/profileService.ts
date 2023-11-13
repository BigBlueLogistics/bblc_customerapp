import { TValidationSchema as TChangePass } from "organisms/Profile/ChangePassword/validationSchema";
import { TValidationSchema as TUpdateProfile } from "organisms/Profile/Main/validationSchema";
import HttpAdapter from "./httpAdapter";

class ProfileService extends HttpAdapter {
  changePass(data: TChangePass) {
    return this.post("/profile/change-password", data);
  }

  updateProfile(data: TUpdateProfile) {
    return this.post("/profile/update", data);
  }

  getProfile() {
    return this.get("/profile/edit");
  }
}

export default ProfileService;
