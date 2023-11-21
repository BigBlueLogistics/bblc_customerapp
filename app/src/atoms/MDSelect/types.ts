import { SxProps, Theme } from "@mui/system";

export type TMDSelect<TOptions> = {
  variant: "filled" | "standard" | "outlined";
  name?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  onChange: (e: any) => void;
  showArrowIcon?: boolean;
  optKeyValue?: keyof TOptions;
  optKeyLabel?: keyof TOptions;
  options: TOptions[];
  value: string | number;
  sx?: SxProps<Theme>;
  itemStyle?: SxProps<Theme>;
  withOptionKeys?: boolean;
};

export type TOwnerState = {
  ownerState: {
    variant: "filled" | "standard" | "outlined";
    showArrowIcon?: TMDSelect<object>["showArrowIcon"];
  };
};
