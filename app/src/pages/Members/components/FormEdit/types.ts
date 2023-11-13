import { ResponseUpdateMemberEntity, ResponseViewMemberEntity } from "entities/members";

export type IFormEdit = {
  open: boolean;
  onClose: () => void;
  onUpdate: (userId: string, data: { [key: string]: any }) => void;
  viewData: ResponseViewMemberEntity;
  updateData: ResponseUpdateMemberEntity;
};
