import { FormControlProps } from "@mui/material";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import { SxProps, Theme } from "@mui/system";

export type TMDSelect<TOptions> = {
  variant: "filled" | "standard" | "outlined";
  name?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  onChange: SelectInputProps<HTMLElement>["onChange"];
  showArrowIcon?: boolean;
  optKeyValue?: keyof TOptions;
  optKeyLabel?: keyof TOptions;
  options: TOptions[];
  value: string | number;
  itemStyle?: SxProps<Theme>;
  withOptionKeys?: boolean;
} & FormControlProps;

export type TOwnerState = {
  ownerState: {
    variant: "filled" | "standard" | "outlined";
    showArrowIcon?: TMDSelect<object>["showArrowIcon"];
  };
};
