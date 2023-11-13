import * as yup from "yup";

const validationSchema = yup.object({
  phone_num: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .required("required"),
  van_status: yup.boolean(),
  invnt_report: yup.boolean(),
});

export type TValidationSchema = yup.InferType<typeof validationSchema>;

export default validationSchema;
