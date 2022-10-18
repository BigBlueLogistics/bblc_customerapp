import storage from "redux-persist/es/storage";
import { createTransform } from "redux-persist";
import { signIn } from "redux/auth/action";
import { AuthStoreType } from "types/authStore";

// Clear and not persist object keys below except auth key.
const authPersistFilter = createTransform(
  null,
  (state: AuthStoreType) => {
    const authState = { ...state };
    authState.request[signIn.pending.type] = {};
    authState.successfulRequests[signIn.fulfilled.type] = {
      ...authState.successfulRequests[signIn.fulfilled.type],
    };
    authState.failedRequests[signIn.rejected.type] = {};
    return authState;
  },
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "bblc-customer",
  storage,
  whitelist: ["auth"],
  transforms: [authPersistFilter],
};

export default persistConfig;
