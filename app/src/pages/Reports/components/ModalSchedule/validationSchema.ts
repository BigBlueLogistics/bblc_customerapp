import * as yup from "yup";

const validationSchema = yup.object({
  freqy: yup.string().required("required"),
  invty1: yup.string(),
  invty2: yup.string(),
  invty3: yup.string(),
  time1: yup.string(),
  time2: yup.string(),
  time3: yup.string(),
});

export type TValidationSchedule = yup.InferType<typeof validationSchema>;

export default validationSchema;
