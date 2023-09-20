import { ResponseUpdateMemberEntity, ResponseViewMemberEntity } from "entities/members";
// import { TStatus } from "types/status";

export type IFormEdit = {
  open: boolean;
  onClose: () => void;
  onUpdate: (userId: number, data: { [key: string]: any }) => void;
  // data: {
  //   [key: string]: any;
  // };
  // isLoadingEdit: boolean;
  // isLoadingUpdate: boolean;
  // status: TStatus;
  // message: string;

  viewData: ResponseViewMemberEntity;
  updateData: ResponseUpdateMemberEntity;
};
