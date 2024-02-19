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
  formikProps?: FormikProps<TOrderData>;
  onChange?: (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikProps<TOrderData>["setFieldValue"]
  ) => void;
  onDelete?: (fileName: string | File, setValues: FormikProps<TOrderData>["setValues"]) => void;
};
