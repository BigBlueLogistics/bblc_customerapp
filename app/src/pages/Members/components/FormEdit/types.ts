import { ArrayHelpers, FormikProps } from "formik";
import { TViewMemberDetails } from "../../types";
import { TValidationSchema } from "./validationSchema";

export type IFormEdit = {
  open: boolean;
  onClose: () => void;
  onUpdate: (userId: string, data: { [key: string]: any }) => void;
  viewData: TViewMemberDetails;
};

export type IFieldArrayCompanies = {
  arrayHelper: ArrayHelpers;
  formik: FormikProps<TValidationSchema>;
  onDeleteCompanies: (idx: number) => void;
};
