export type IMDSelect = {
  label?: string;
  helperText?: string;
  onChange: () => void;
  showArrowIcon?: boolean;
  optKeyValue?: string;
  optKeyLabel?: string;
  options: { value: string | number; label: string }[];
  value: string | number;
};
