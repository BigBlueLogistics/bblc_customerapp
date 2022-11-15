import { DrawerProps } from "@mui/material";

export type ISidenav = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  brand?: string;
  brandName: string;
  accountRole: string;
  routes: { [key: string]: any }[];
  handleSignOut: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export type ISidenavCollapse = {
  icon: React.ReactNode;
  name: string;
  active?: boolean;
} & DrawerProps;
