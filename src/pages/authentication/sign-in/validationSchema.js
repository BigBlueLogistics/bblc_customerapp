import * as yup from "yup";

export default yup.object({
  email: yup.string("Enter your email").email("Enter valid email").required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters")
    .required("Password is required"),
});
