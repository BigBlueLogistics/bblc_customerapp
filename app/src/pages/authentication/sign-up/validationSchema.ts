import * as yup from "yup";

export default yup.object({
  fname: yup.string().required("required"),
  lname: yup.string().required("required"),
  phone_no: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .required("required"),
  customer_code: yup.string().required("required"),
  email: yup.string().email("Invalid email address").required("required"),
  password: yup.string().min(8, "Password requires minimum of 8 characters.").required("required"),
});
