export type TMasterCard = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  number: number;
  holder: string;
  expires: string;
};
