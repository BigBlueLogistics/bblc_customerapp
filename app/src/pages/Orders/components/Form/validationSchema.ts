import * as yup from "yup";

export default yup.object({
  ref_number: yup
    .string()
    .required("required")
    .max(12, "maximum of 12 characters")
    .matches(/^[^'%"]+$/i, `not allowed characters: '%"`),
  source_wh: yup.string().required("required"),
  instruction: yup
    .string()
    .nullable()
    .matches(/^[^'%"]+$/i, `not allowed characters: '%"`),
  requests: yup
    .array(
      yup.object({
        material: yup.string().required("required"),
        units: yup.string().required("required"),
        qty: yup
          .number()
          .typeError("numbers only")
          .required("required")
          .max(yup.ref("available"), ({ max }) => `must be less than or equal to ${max}`)
          .min(1, ({ min }) => `must be greater than or equal to ${min}`),
      })
    )
    .min(1, "Required to input one item! Please ADD ROW"),
});
