import { TNotices } from "../types";

export default function miscData() {
  const initialNotices: TNotices = {
    message: null,
    data: null,
    status: "idle",
    type: null,
  };

  return {
    initialNotices,
  };
}
