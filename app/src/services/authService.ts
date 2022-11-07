import { SignInFormType, SignUpFormType, ResetPassLinkType, ResetPassType } from "types/authForm";
import HttpAdapter from "./httpAdapter";

class AuthService extends HttpAdapter {
  signIn(formData: SignInFormType) {
    return this.get("/auth/login", { params: formData });
  }

  signUp(formData: SignUpFormType) {
    return this.post("/auth/register", formData);
  }

  resetPassLink(formData: ResetPassLinkType) {
    return this.post("/auth/reset-password-link", formData);
  }

  resetPass(formData: ResetPassType) {
    return this.post("/auth/reset-password", formData);
  }

  signOut() {
    return this.get("/auth/logout");
  }

  reAuthenticate() {
    return this.get("/auth/is-authenticated");
  }
}

export default AuthService;
