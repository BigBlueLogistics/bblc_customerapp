import * as yup from "yup";

const validationSchema = yup.object({
  actionType: yup.string().nullable(),
  fname: yup.string().when("actionType", (isActionType, schema) => {
    return isActionType === "create" ? schema.required("required") : schema.nullable();
  }),
  lname: yup.string().when("actionType", (isActionType, schema) => {
    return isActionType === "create" ? schema.required("required") : schema.nullable();
  }),
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
