import { SxProps, Theme } from "@mui/system";

export type TMDSelect = {
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
  sx?: SxProps<Theme>;
  itemStyle?: SxProps<Theme>;
  withOptionKeys?: boolean;
};

export type TOwnerState = {
  ownerState: {
    showArrowIcon: TMDSelect["showArrowIcon"];
    variant: "filled" | "standard" | "outlined";
  };
};
