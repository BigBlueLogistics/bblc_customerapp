import { SignInFormType, SignUpFormType, ResetPassType, ChangePassType } from "types/authForm";
import HttpAdapter from "./httpAdapter";

class AuthService extends HttpAdapter {
  constructor(token = "") {
    super(token);
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

  signOut() {
    return this.get("/auth/logout");
  }
}

export default AuthService;
