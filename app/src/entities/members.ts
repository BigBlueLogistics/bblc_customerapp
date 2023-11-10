import { TResponse } from "./response";

export type MembersEntity = {
  id: number;
  fname: string;
  lname: string;
  email: string;
  role_id: number;
  email_verified_at: string;
  active: boolean;
  email_verified_sent: number;
  created_at: string;
  updated_at: string;
  company: {
    user_id: number;
    customer_code: string;
  };
};

export type ViewMemberEntity = {
  id: string;
  fname: string;
  lname: string;
  phone_num: string;
  email: string;
  role_id: string;
  email_verified_at: string;
  active: boolean;
  customer_code: string;
  company: string;
  roles: { id: number; name: string }[];
  van_status: boolean;
};

export type UpdateMemberEntity = ViewMemberEntity;

export type ResponseMembersEntity = TResponse<MembersEntity[]>;
export type ResponseViewMemberEntity = TResponse<ViewMemberEntity>;
export type ResponseUpdateMemberEntity = TResponse<UpdateMemberEntity>;
