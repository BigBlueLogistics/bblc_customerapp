import { createSlice } from "@reduxjs/toolkit";
import { AuthStoreType } from "types/authStore";
import { signIn, signUp, resetPassLink, resetPass, signOut, reAuthenticate } from "./thunk";

const initialState: AuthStoreType = {
  successfulRequests: {},
  failedRequests: {},
  request: {},
  authenticated: false,
  apiToken: "",
  customerCode: "",
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    resetData: () => {
      return initialState;
    },
    setCustomerCode: (state, action) => {
      state.customerCode = action.payload;
    },
    updateProfileFromMember: (state, action) => {
      const { payload } = action || {};
      const companies = payload.companies.map((company) => company.customer_code);
      const [newRole] = payload.roles.filter((role) => Number(role.id) === Number(payload.role_id));

      state.successfulRequests[signIn.fulfilled.type].data = {
        ...payload,
        companies,
        role_name: newRole.name,
      };

      // Set default customer_code
      state.customerCode = payload.companies?.length ? payload.companies[0].customer_code : "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.request[signIn.pending.type] = { status: "loading" };
        state.authenticated = false;
        state.apiToken = "";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.successfulRequests[signIn.fulfilled.type] = {
          data: action.payload.data.user,
          message: action.payload.message,
        };
        state.request[signIn.pending.type] = { status: "succeeded" };
        state.authenticated = true;
        state.apiToken = action.payload.data.token;
        state.customerCode =
          action.payload.data.user.companies.length >= 1
            ? action.payload.data.user.companies[0]
            : "";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.failedRequests[signIn.rejected.type] = { message: action.error.message };
        state.request[signIn.pending.type] = { status: "failed" };
      })
      .addCase(signUp.pending, (state) => {
        state.request[signUp.pending.type] = { status: "loading" };
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.successfulRequests[signUp.fulfilled.type] = { data: action.payload };
        state.successfulRequests[signUp.fulfilled.type] = { message: action.payload.message };
        state.request[signUp.pending.type] = { status: "succeeded" };
      })
      .addCase(signUp.rejected, (state, action) => {
        state.failedRequests[signUp.rejected.type] = { message: action.error.message };
        state.request[signUp.pending.type] = { status: "failed" };
      })
      .addCase(resetPassLink.pending, (state) => {
        state.request[resetPassLink.pending.type] = { status: "loading" };
      })
      .addCase(resetPassLink.fulfilled, (state, action) => {
        state.successfulRequests[resetPassLink.fulfilled.type] = { data: action.payload };
        state.successfulRequests[resetPassLink.fulfilled.type] = {
          message: action.payload.message,
        };
        state.request[resetPassLink.pending.type] = { status: "succeeded" };
      })
      .addCase(resetPassLink.rejected, (state, action) => {
        state.failedRequests[resetPassLink.rejected.type] = { message: action.error.message };
        state.request[resetPassLink.pending.type] = { status: "failed" };
      })
      .addCase(resetPass.pending, (state) => {
        state.request[resetPass.pending.type] = { status: "loading" };
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.successfulRequests[resetPass.fulfilled.type] = { data: action.payload };
        state.successfulRequests[resetPass.fulfilled.type] = { message: action.payload.message };
        state.request[resetPass.pending.type] = { status: "succeeded" };
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.failedRequests[resetPass.rejected.type] = { message: action.error.message };
        state.request[resetPass.pending.type] = { status: "failed" };
      })
      .addCase(signOut.pending, (state) => {
        state.request[signOut.pending.type] = { status: "loading" };
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.successfulRequests[signOut.fulfilled.type] = { data: action.payload };
        state.successfulRequests[signOut.fulfilled.type] = { message: action.payload.message };
        state.request[signOut.pending.type] = { status: "succeeded" };

        // Clear sign-in
        state.successfulRequests[signIn.fulfilled.type] = {};
        state.apiToken = "";
        state.customerCode = "";
      })
      .addCase(signOut.rejected, (state, action) => {
        state.failedRequests[signOut.rejected.type] = { message: action.error.message };
        state.request[signOut.pending.type] = { status: "failed" };
      })
      .addCase(reAuthenticate.pending, (state) => {
        state.request[signIn.pending.type] = { status: "loading" };
      })
      .addCase(reAuthenticate.fulfilled, (state, action) => {
        state.successfulRequests[signIn.fulfilled.type] = {
          data: action.payload.data.user,
          message: action.payload.message,
        };
        state.request[signIn.pending.type] = { status: "succeeded" };
        state.authenticated = true;
        state.apiToken = action.payload.data.token;
      })
      .addCase(reAuthenticate.rejected, (state, action) => {
        state.failedRequests[signIn.rejected.type] = { message: action.error.message };
        state.request[signIn.pending.type] = { status: "failed" };
        state.authenticated = false;
        state.apiToken = "";
        state.customerCode = "";
      });
  },
});

export const { setIsAuthenticated, resetData, setCustomerCode, updateProfileFromMember } =
  authReducer.actions;
export default authReducer.reducer;
