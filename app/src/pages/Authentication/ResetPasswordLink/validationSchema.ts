import * as yup from "yup";

export default yup.object({
  email: yup.string().email("Invalid email address").required("required"),
});
