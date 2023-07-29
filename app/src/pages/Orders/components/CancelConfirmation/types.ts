export type ICancelConfirmation = {
  openConfirmation: boolean;
  transId: string;
  isLoading: boolean;
  OnCancelYes: (transId: string) => void;
  OnCancelNo: () => void;
};
