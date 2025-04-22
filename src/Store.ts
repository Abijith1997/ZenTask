import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./Slices/TodoSlice";
import noteReducer from "./Slices/NoteSlice";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    note: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
