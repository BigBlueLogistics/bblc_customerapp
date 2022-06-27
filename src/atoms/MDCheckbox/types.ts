import { CheckboxProps } from "@mui/material";

export type IMDCheckbox = Partial<{
  label: string;
  onChange: () => void;
  checked: boolean;
}> &
  CheckboxProps;
