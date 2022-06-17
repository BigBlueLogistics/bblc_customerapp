export type ISidenav = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  brand?: string;
  brandName: string;
  routes: { [key: string]: any }[];
};

export type ISidenavCollapse = {
  icon: React.ReactNode;
  name: string;
  active?: boolean;
};
