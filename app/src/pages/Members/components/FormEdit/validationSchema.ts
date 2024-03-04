import * as yup from "yup";

const validationSchema = yup.object({
  id: yup.string().required(),
  companies: yup
    .array(
      yup.object({
        id: yup.string(),
        customer_code: yup
          .string()
          .required("required")
          .min(8, "Must be exactly 8 characters")
          .max(8, "Must be exactly 8 characters"),
        company: yup.string().required("required"),
      })
    )
    .min(1, "Required to input one customer! Please ADD ROW"),
  fname: yup.string().required("required"),
  lname: yup.string().required("required"),
  email: yup.string().email("Enter valid email").required("required"),
  email_verified_at: yup.string(),
  phone_num: yup
    .string()
    .matches(/^09[0-9]{9}$/, "Invalid format")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits"),
  is_verify: yup.boolean(),
  is_active: yup.boolean(),
  role_id: yup.string(),
  van_status: yup.boolean(),
  invnt_report: yup.boolean(),
});

export type TValidationMemberForm = yup.InferType<typeof validationSchema>;

export default validationSchema;
