import * as yup from "yup";

export default yup.object({
  freqy: yup.string().required("required"),
  invty1: yup.string(),
  invty2: yup.string(),
  invty3: yup.string(),
  time1: yup.string(),
  time2: yup.string(),
  time3: yup.string(),
});
