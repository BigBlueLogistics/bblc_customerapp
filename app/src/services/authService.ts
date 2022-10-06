import { SignInFormType, SignUpFormType, ResetPassType, ChangePassType } from "types/authForm";
import HttpAdapter from "./httpAdapter";

class AuthService extends HttpAdapter {
  constructor() {
    super("");
  }

  signIn(formData: SignInFormType) {
    return this.get("/auth/login", { params: formData });
  }

  signUp(formData: SignUpFormType) {
    return this.post("/auth/register", formData);
  }

  resetPass(formData: ResetPassType) {
    return this.post("/auth/reset-password", formData);
  }

  changePass(formData: ChangePassType) {
    return this.post("/auth/change-password", formData);
  }
}

const auth = new AuthService();
export default auth;