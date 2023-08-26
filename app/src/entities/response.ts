import { IStatus } from "types/status";

export type TResponse<TData, TMessage extends unknown = string> = {
  status: IStatus;
  data: TData;
  message: TMessage;
};
