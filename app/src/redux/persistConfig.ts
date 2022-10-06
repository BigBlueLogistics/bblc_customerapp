import storage from "redux-persist/es/storage";
import { createTransform } from "redux-persist";
import { signIn } from "redux/auth/action";
import { AuthStoreType } from "types/authStore";

const authPersistFilter = createTransform(
  null,
  (state: AuthStoreType) => {
    const authState = { ...state };
    authState.request[signIn.pending.type] = {};
    authState.successfulRequests[signIn.fulfilled.type] = {};
    authState.failedRequests[signIn.rejected.type] = {};
    return authState;
  },
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [authPersistFilter],
};

export default persistConfig;
