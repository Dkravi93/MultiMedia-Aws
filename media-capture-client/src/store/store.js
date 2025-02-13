import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./slices/mediaSlice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
  },
});
