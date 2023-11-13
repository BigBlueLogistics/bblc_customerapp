import { TResponse } from "./response";

export type ProfileEntity = {
  phone_num: string;
  van_status: boolean;
  invnt_report: boolean;
};

export type ProfileChangePassEntity = string;

export type ResponseProfileEntity = TResponse<ProfileEntity>;
export type ResponseProfileChangePassEntity = TResponse<ProfileChangePassEntity>;
