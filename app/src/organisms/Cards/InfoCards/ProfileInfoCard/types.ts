export type TProfileInfoCard = {
  title: string;
  description: string;
  info: { [key: string]: string };
  action: {
    route: string;
    tooltip: string;
  };
  shadow?: boolean;
};
