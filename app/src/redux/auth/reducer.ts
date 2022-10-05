import { createSlice } from "@reduxjs/toolkit";
import { signIn, signUp, resetPass, changePass } from "./thunk";

type StateType = {
  succeededRequests: object;
  failedRequests: object;
  request: object;
  authenticated: boolean;
};

const initialState: StateType = {
  succeededRequests: {},
  failedRequests: {},
  request: {},
  authenticated: false,
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.request[signIn.pending.type] = { status: "loading" };
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.succeededRequests[signIn.fulfilled.type] = { data: action.payload };
        state.succeededRequests[signIn.fulfilled.type] = { message: action.payload.message };
        state.request[signIn.pending.type] = { status: "succeeded" };
      })
      .addCase(signIn.rejected, (state, action) => {
        state.failedRequests[signIn.rejected.type] = { message: action.error.message };
        state.request[signIn.pending.type] = { status: "failed" };
      })
      .addCase(signUp.pending, (state) => {
        state.request[signUp.pending.type] = { status: "loading" };
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.succeededRequests[signUp.fulfilled.type] = { data: action.payload };
        state.succeededRequests[signUp.fulfilled.type] = { message: action.payload.message };
        state.request[signUp.pending.type] = { status: "succeeded" };
      })
      .addCase(signUp.rejected, (state, action) => {
        state.failedRequests[signUp.rejected.type] = { message: action.error.message };
        state.request[signUp.pending.type] = { status: "failed" };
      })
      .addCase(resetPass.pending, (state) => {
        state.request[resetPass.pending.type] = { status: "loading" };
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.succeededRequests[resetPass.fulfilled.type] = { data: action.payload };
        state.succeededRequests[resetPass.fulfilled.type] = { message: action.payload.message };
        state.request[resetPass.pending.type] = { status: "succeeded" };
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.failedRequests[resetPass.rejected.type] = { message: action.error.message };
        state.request[resetPass.pending.type] = { status: "failed" };
      })
      .addCase(changePass.pending, (state) => {
        state.request[changePass.pending.type] = { status: "loading" };
      })
      .addCase(changePass.fulfilled, (state, action) => {
        state.succeededRequests[changePass.fulfilled.type] = { data: action.payload };
        state.succeededRequests[changePass.fulfilled.type] = { message: action.payload.message };
        state.request[changePass.pending.type] = { status: "succeeded" };
      })
      .addCase(changePass.rejected, (state, action) => {
        state.failedRequests[changePass.rejected.type] = { message: action.error.message };
        state.request[changePass.pending.type] = { status: "failed" };
      });
  },
});

export const actionType = authReducer.caseReducers;
export default authReducer.reducer;
