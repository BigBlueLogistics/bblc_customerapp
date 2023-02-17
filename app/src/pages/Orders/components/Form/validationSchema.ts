import * as yup from "yup";

export default yup.object({
  ref_number: yup
    .number()
    .typeError("not a number")
    .required("required")
    .test({
      name: "exact-digits",
      message: "Number of digits must 12",
      exclusive: true,
      test: (value) => String(value).length === 12,
    }),
  source_wh: yup.string().required("required"),
});
