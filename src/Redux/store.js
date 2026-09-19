import { configureStore } from "@reduxjs/toolkit";
import { authentication } from "./feature/auth";
import { baseApi } from "./feature/baseApi";

export const store = configureStore({
  reducer: {
    [authentication.reducerPath]: authentication.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authentication.middleware)
      .concat(baseApi.middleware),
});