import { SxProps } from "@mui/system";

export type IMDSelect = {
  variant: "filled" | "standard" | "outlined";
  name?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  onChange: (e: any) => void;
  showArrowIcon?: boolean;
  optKeyValue?: string;
  optKeyLabel?: string;
  options: { value: string | number; label: string }[] | string[];
  value: string | number;
  sx?: SxProps;
  withOptionKeys?: boolean;
};

export type IOwnerState = {
  ownerState: {
    showArrowIcon: IMDSelect["showArrowIcon"];
    variant: "filled" | "standard" | "outlined";
  };
};
