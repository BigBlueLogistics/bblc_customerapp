export type IAutoCompleteExpiryData = {
  id: string;
  batch: string;
  expiry: string;
};

export type IAutoCompleteExpiry = {
  index: number;
  options: IAutoCompleteExpiryData[];
  onChange: (value: IAutoCompleteExpiryData) => void;
  value: string;
};
