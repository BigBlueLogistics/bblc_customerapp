export type TDefaultProjectCard = {
  image: string;
  label: string;
  title: string;
  description: string;
  action: {
    type: "external" | "internal";
    route: string;
    color:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "light"
      | "dark"
      | "white";
    label: string;
  };
  authors?: { [key: string]: any }[];
};
