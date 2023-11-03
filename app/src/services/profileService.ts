import { ChangePassType } from "types/authForm";
import HttpAdapter from "./httpAdapter";

class ProfileService extends HttpAdapter {
  changePass(data: ChangePassType) {
    return this.post("/profile/change-password", data);
  }

  updateProfile(data: { phone_num: string; van_status: string }) {
    return this.post("/profile/update", data);
  }

  getProfile() {
    return this.get("/profile/edit");
  }
}

export default ProfileService;
