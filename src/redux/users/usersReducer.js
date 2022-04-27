import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  uname: "",
  email: "",
  token: "",
};

export const usersReducer = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default usersReducer.reducer;
