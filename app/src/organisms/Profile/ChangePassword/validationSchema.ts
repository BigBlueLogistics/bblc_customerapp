import * as yup from "yup";

const validationSchema = yup.object({
  current_password: yup.string().required("required").min(8, "should be minimum of 8 characters"),
  new_password: yup
    .string()
    .required("required")
    .min(8, "should be minimum of 8 characters")
    .oneOf([yup.ref("confirm_password"), null], "New password not match"),
  confirm_password: yup
    .string()
    .required("required")
    .min(8, "should be minimum of 8 characters")
    .oneOf([yup.ref("new_password"), null], "New password not match"),
});

export type TValidationSchema = yup.InferType<typeof validationSchema>;

export default validationSchema;
