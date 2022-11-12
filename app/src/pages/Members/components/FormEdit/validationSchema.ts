import * as yup from "yup";

export default yup.object({
  customer_code: yup
    .string()
    .min(8, "Must be exactly 8 characters")
    .max(8, "Must be exactly 8 characters"),
  fname: yup.string().required("required"),
  lname: yup.string().required("required"),
  email: yup.string().email("Enter valid email").required("required"),
  email_verified_at: yup.date(),
  is_verify: yup.boolean(),
  is_active: yup.boolean(),
});
