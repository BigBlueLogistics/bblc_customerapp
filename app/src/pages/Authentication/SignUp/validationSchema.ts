import * as yup from "yup";

const validationSchema = yup.object({
  fname: yup.string().required("required"),
  lname: yup.string().required("required"),
  phone_num: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .required("required"),
  company: yup.string().required("required"),
  email: yup.string().email("Invalid email address").required("required"),
  password: yup.string().min(8, "Requires minimum of 8 characters.").required("required"),
});

export type TValidationSchema = yup.InferType<typeof validationSchema>;

export default validationSchema;
