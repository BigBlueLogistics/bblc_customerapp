import { createAsyncThunk } from "@reduxjs/toolkit";
import { authServices } from "services";
import { SignInFormType, SignUpFormType, ResetPassLinkType, ResetPassType } from "types/authForm";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: SignInFormType) => {
    try {
      const response = await authServices.signIn({ email, password });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error.message;
      }
    }
  }
);

export const signUp = createAsyncThunk("auth/signup", async (payload: SignUpFormType) => {
  try {
    const response = await authServices.signUp(payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error.message;
    }
  }
});

export const resetPassLink = createAsyncThunk(
  "auth/reset-pass-link",
  async (payload: ResetPassLinkType) => {
    try {
      const response = await authServices.resetPassLink(payload);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error.message;
      }
    }
  }
);

export const resetPass = createAsyncThunk("auth/reset-pass", async (payload: ResetPassType) => {
  try {
    const response = await authServices.resetPass(payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error.message;
    }
  }
});

export const signOut = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await authServices.signOut();
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error.message;
    }
  }
});

export const reAuthenticate = createAsyncThunk("auth/is-authenticated", async () => {
  try {
    const response = await authServices.reAuthenticate();
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error.message;
    }
  }
});
