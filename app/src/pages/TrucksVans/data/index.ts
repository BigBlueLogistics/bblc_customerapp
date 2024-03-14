import { TNotices, TSearchTrucksVans } from "../types";

export default function miscData() {
  const initialNotices: TNotices = {
    message: null,
    data: null,
    status: "idle",
    type: null,
  };

  const initialSearchResult: TSearchTrucksVans = {
    message: null,
    data: [],
    status: "idle",
  };

  return {
    initialNotices,
    initialSearchResult,
  };
}
