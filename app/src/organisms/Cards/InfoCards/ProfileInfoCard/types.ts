export type IProfileInfoCard = {
  title: string;
  description: string;
  info: { [key: string]: string };
  social: { [key: string]: any }[];
  action: {
    route: string;
    tooltip: string;
  };
  shadow?: boolean;
};
