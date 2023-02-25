import * as yup from "yup";

export default yup.object({
  ref_number: yup
    .string()
    .required("required")
    .length(12, "Number of digits must 12")
    .matches(/^\d+$/gi, "Numbers only"),
  source_wh: yup.string().required("required"),
  requests: yup
    .array(
      yup.object({
        material: yup.string().required("required"),
        units: yup.string().required("required"),
        qty: yup.number().required("required"),
      })
    )
    .min(1, "Required to input one item! Please ADD ROW"),
});
