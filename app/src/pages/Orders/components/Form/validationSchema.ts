import * as yup from "yup";

export default yup.object({
  ref_number: yup
    .string()
    .required("required")
    .length(12, "number of digits must 12")
    .matches(/^\d+$/gi, "numbers only"),
  source_wh: yup.string().required("required"),
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
