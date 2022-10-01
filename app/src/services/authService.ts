import { SignInFormType, SignUpFormType } from "types/authForm";
import HttpAdapter from "./httpAdapter";

class AuthService extends HttpAdapter {
  constructor() {
    super("prd", "");
  }

  signIn(formData: SignInFormType) {
    return this.get("/auth/login", { params: formData });
  }

  signUp(formData: SignUpFormType) {
    return this.post("/auth/register", formData);
  }
}

const auth = new AuthService();
export default auth;
