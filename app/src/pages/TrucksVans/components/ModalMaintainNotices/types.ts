import { TNotices } from "pages/TrucksVans/types";
import { FormikHelpers } from "formik";
import { TValidationNotices } from "./validationSchema";

export type TMaintainNotices = {
  data: TNotices;
  open: boolean;
  onClose: () => void;
  onCreateNotices: (data: TValidationNotices, helper: FormikHelpers<TValidationNotices>) => void;
  onDeleteNotices: (data: TValidationNotices, helper: FormikHelpers<TValidationNotices>) => void;
};
