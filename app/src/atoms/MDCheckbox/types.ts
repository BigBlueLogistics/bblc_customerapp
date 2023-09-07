import { ChangeEvent } from "react";
import { CheckboxProps } from "@mui/material";

export type TMDCheckbox = Partial<{
  name: string;
  label: string;
  onChange: (e: ChangeEvent<any>) => void;
  checked: boolean;
}> &
  CheckboxProps;
