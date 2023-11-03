import * as yup from "yup";

export default yup.object({
  id: yup.number().required(),
  customer_code: yup
    .string()
    .required("required")
    .min(8, "Must be exactly 8 characters")
    .max(8, "Must be exactly 8 characters"),
  company_name: yup.string().required("required"),
  fname: yup.string().required("required"),
  lname: yup.string().required("required"),
  email: yup.string().email("Enter valid email").required("required"),
  email_verified_at: yup.date(),
  is_verify: yup.boolean(),
  is_active: yup.boolean(),
  role_id: yup.number(),
  van_status: yup.boolean(),
});
