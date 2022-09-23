export type IMDSelect = {
  label?: string;
  helperText?: string;
  onChange: (e: any) => void;
  showArrowIcon?: boolean;
  optKeyValue?: string;
  optKeyLabel?: string;
  options: { value: string | number; label: string }[];
  value: string | number;
};

export type IOwnerState = {
  ownerState: { showArrowIcon: IMDSelect["showArrowIcon"] };
};
