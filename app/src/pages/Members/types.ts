import { ResponseMembersEntity, ResponseViewMemberEntity } from "entities/members";

export type INotifyDownload = {
  open: boolean;
  message?: string;
  title?: string;
  color?: "info" | "error" | "light" | "primary" | "secondary" | "success" | "warning" | "dark";
};

export type TMembers = ResponseMembersEntity;
export type TViewMemberDetails = ResponseViewMemberEntity & { action: "edit" | "update" | null };
