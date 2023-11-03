import { ResponseProfileEntity } from "entities/profile";

export type TProfileData = {
  van_status: string;
  phone_num: string;
};

export type TMain = {
  data: ResponseProfileEntity;
  title: string;
  onUpdateProfile: (values: TProfileData, isInitialMount: boolean) => void;
  shadow?: boolean;
};
