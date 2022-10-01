import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";

const preloadedState = {};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
