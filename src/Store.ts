import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./Slices/TodoSlice";
import noteReducer from "./Slices/NoteSlice";
import userReducer from "./Slices/UserSlice";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    note: noteReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
