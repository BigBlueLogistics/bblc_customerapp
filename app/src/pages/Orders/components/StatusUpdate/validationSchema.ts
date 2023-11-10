import * as yup from "yup";

const validationSchema = yup.object({
  docNo: yup.string().required("required"),
});

export type TValidationSchema = yup.InferType<typeof validationSchema>;

export default validationSchema;
