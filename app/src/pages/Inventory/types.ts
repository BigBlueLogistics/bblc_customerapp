export type INotifyDownload = {
  open: boolean;
  message: string;
  title: string;
  color: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};
