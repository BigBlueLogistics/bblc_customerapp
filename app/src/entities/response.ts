import { TStatus } from "types/status";

export type TResponse<TData, TMessage extends unknown = string> = {
  status: TStatus;
  data: TData;
  message: TMessage;
};
