import { ReactElement, SyntheticEvent } from "react";
import { FormikProps } from "formik";
import { TOrderData } from "pages/Orders/types";

export type TListFileTooltip = {
  files: (string | File)[] | null;
  open: boolean;
  children: ReactElement;
  formikProps?: FormikProps<TOrderData>;
  messageEmptyFiles?: string;
  onClose: (event: SyntheticEvent | Event) => void;
  onDelete?: (fileName: string | File, setValues: FormikProps<TOrderData>["setValues"]) => void;
};
