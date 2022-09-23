export type IDefaultNavbarLink = {
  icon: string;
  name: string;
  route: string;
  light?: boolean;
};

export type IDefaultNavbarMobile = {
  open: { [key: string]: any } | boolean;
  close: () => void | boolean | { [key: string]: any };
};

export type IDefaultNavbar = {
  transparent?: boolean;
  light?: boolean;
  action?: {
    type: "external" | "internal";
    route: string;
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
    label: string;
  } | null;
};
