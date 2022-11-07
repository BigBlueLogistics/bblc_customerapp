import * as yup from "yup";

export default yup.object({
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be minimum of 8 characters")
    .required("Password is required"),
});
