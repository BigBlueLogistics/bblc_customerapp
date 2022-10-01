import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import { SignInFormType, SignUpFormType } from "types/authForm";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: SignInFormType) => {
    try {
      const response = await AuthService.signIn({ email, password });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
);

export const signUp = createAsyncThunk("auth/signup", async (payload: SignUpFormType) => {
  try {
    const response = await AuthService.signUp(payload);
    return response.data;
  } catch (error) {
    throw error.message;
  }
});
