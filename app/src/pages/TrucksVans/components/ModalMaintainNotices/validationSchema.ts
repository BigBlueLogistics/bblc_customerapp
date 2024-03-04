import * as yup from "yup";

const validationSchema = yup.object({
  actionType: yup.string().nullable().oneOf(["create", "delete"]),
  fname: yup.string().nullable(),
  lname: yup.string().nullable(),
  emailAdd: yup.string().email().nullable(),
  phoneNum: yup
    .string()
    .required("required")
    .matches(/^09[0-9]{9}$/, "Invalid format")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits"),
});

export type TValidationNotices = yup.InferType<typeof validationSchema>;

export default validationSchema;
