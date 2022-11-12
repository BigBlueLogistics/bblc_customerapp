export type IFormEdit = {
  open: boolean;
  onClose: () => void;
  data: {
    [key: string]: any;
  };
  isLoading: boolean;
};
