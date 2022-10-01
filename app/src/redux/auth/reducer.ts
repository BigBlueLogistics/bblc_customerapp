/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { signIn, signUp } from "./thunk";

type StateType = {
  status: "idle" | "loading" | "succeeded" | "failed";
  data: any;
  errorMsg: string;
};

const initialState: StateType = {
  status: "idle",
  data: null,
  errorMsg: "",
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.errorMsg = action.error.message;
        state.status = "failed";
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.errorMsg = action.error.message;
        state.status = "failed";
      });
  },
});

export default authReducer.reducer;
