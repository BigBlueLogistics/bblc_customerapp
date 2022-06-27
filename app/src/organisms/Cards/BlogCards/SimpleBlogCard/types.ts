export type ISimpleBlogCard = {
  image: string;
  title: string;
  description: string;
  action: {
    type: "external" | "internal";
    route: string;
    color?:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "dark"
      | "light"
      | "default";
    label: string;
  };
};
