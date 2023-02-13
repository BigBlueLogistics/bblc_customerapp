import * as yup from "yup";

export default yup.object({
  ref_number: yup.number().typeError("not a number").required("required"),
  source_wh: yup.string().required("required"),
});
