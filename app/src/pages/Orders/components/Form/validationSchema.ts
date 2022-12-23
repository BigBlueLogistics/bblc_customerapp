import * as yup from "yup";

export default yup.object({
  po_number: yup.number().required("required"),
  po_date: yup.date().required("required"),
});
