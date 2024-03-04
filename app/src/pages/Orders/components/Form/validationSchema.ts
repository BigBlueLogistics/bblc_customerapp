import * as yup from "yup";

const validationSchema = yup.object({
  ref_number: yup
    .string()
    .required("required")
    .max(12, "maximum of 12 characters")
    .matches(/^[^'%"]+$/i, `not allowed characters: '%"`),
  source_wh: yup.string().required("required"),
  pickup_date: yup.date().nullable(),
  allow_notify: yup.boolean(),
  instruction: yup
    .string()
    .nullable()
    .matches(/^[^'%"]+$/i, `not allowed characters: '%"`),
  requests: yup
    .array(
      yup.object({
        uuid: yup.string(),
        material: yup.string().required("required"),
        description: yup.string().nullable(),
        units: yup.string().required("required"),
        batch: yup.string().nullable(),
        expiry: yup.string().nullable(),
        available: yup.number().typeError("numbers only"),
        qty: yup
          .number()
          .typeError("numbers only")
          .required("required")
          .max(yup.ref("available"), ({ max }) => `must be less than or equal to ${max}`)
          .min(1, ({ min }) => `must be greater than or equal to ${min}`),
        remarks: yup
          .string()
          .nullable()
          .max(35, "maximum of 35 characters")
          .matches(/^[^'%"]+$/i, `not allowed characters: '%"`),
        created_at: yup.string(),
      })
    )
    .min(1, "Required to input one item! Please ADD ROW"),
});

export type TValidationOrderForm = yup.InferType<typeof validationSchema>;

export default validationSchema;
