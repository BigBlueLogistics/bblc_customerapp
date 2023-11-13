import { ResponseProfileEntity } from "entities/profile";

export type TProfileData = {
  phone_num: string;
  van_status: boolean;
  invnt_report: boolean;
};

export type TMain = {
  data: ResponseProfileEntity;
  title: string;
  onUpdateProfile: (values: TProfileData, isInitialMount: boolean) => void;
  shadow?: boolean;
};
