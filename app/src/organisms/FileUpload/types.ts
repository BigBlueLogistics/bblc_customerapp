import { ChangeEvent } from "react";
import { FormikProps } from "formik";
import { TOrderData } from "pages/Orders/types";

export type TFileUpload = {
  localFiles: File[];
  remoteFiles?: string[];
  showRemoteFiles?: boolean;
  name?: string;
  multiple?: boolean;
  accept?: string;
  disabledUpload?: boolean;
  loading?: boolean;
  formikProps?: FormikProps<TOrderData>;
  onUpload?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (fileName: string | File, setValues: FormikProps<TOrderData>["setValues"]) => void;
};
