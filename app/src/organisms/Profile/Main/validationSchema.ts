import * as yup from "yup";

export default yup.object({
  phone_num: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .required("required"),
  van_status: yup.string().required("required"),
});
