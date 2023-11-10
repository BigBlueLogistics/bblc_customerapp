import * as yup from "yup";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email address").required("required"),
});

export type TValidationSchema = yup.InferType<typeof validationSchema>;

export default validationSchema;
