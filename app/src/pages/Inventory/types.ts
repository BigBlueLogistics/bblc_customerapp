export type INotifyDownload = {
  key: string | number;
  open: boolean;
  message: string;
  title: string;
  autoHideDuration?: number | null;
  color: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type ITableHeaderProps = {
  globalFilteredRows: Record<string, any>[];
};
