import * as yup from "yup";

export default yup.object({
  password: yup.string().min(8, "Requires minimum of 8 characters.").required("required"),
  confirm_password: yup
    .string()
    .min(8, "Requires minimum of 8 characters.")
    .oneOf([yup.ref("password"), null], "Password must match")
    .required("required"),
});
