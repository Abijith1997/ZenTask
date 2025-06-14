import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import { userData } from "../Interface/Types";

interface userState {
  user: {
    [id: string]: userData;
  };
}

interface UserUpdate {
  id: string;
  updates: Partial<Omit<userData, "id" | "created_at">>;
}

const initialState: userState = {
  user: {},
};

export const insertUserInDB = createAsyncThunk(
  "user/insertUser",
  async (user: userData, { rejectWithValue }) => {
    if (!user) {
      return rejectWithValue("Nothing to insert.");
    }
    const { data, error } = await supabase.from("Users").insert(user).select();
    if (error) {
      return rejectWithValue(error.message);
    }
    console.log(data, "data");
    return data;
  }
);

export const updateUserInDB = createAsyncThunk(
  "notes/updateNoteInDB",
  async (userUpdate: UserUpdate, { rejectWithValue }) => {
    const { id, updates } = userUpdate;
    if (!id || !updates) {
      return rejectWithValue("Invalid User update data");
    }
    const { data, error } = await supabase
      .from("Users")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const deleteUserInDB = createAsyncThunk(
  "notes/deleteUserInDB",
  async (
    id: `${string}-${string}-${string}-${string}-${string}`,
    { rejectWithValue }
  ) => {
    if (!id) {
      return rejectWithValue("No user id provided.");
    }

    const { data, error } = await supabase
      .from("User")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<userData>) => {
      const user = action.payload;
      state.user[user.id] = user;
    },
    setUser: (state, action: PayloadAction<userData>) => {
      const user = action.payload;
      state.user[user.id] = user;
    },
    updateUser: (state, action: PayloadAction<userData>) => {
      const updatedUser = action.payload;
      if (state.user[updatedUser.id]) {
        state.user[updatedUser.id] = updatedUser;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      delete state.user[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertUserInDB.fulfilled, (state, action) => {
        const users = action.payload as userData[]; // note the array
        if (Array.isArray(users) && users.length > 0) {
          const user = users[0];
          if (user.id) {
            state.user[user.id] = user;
          }
        }
      })
      .addCase(insertUserInDB.rejected, (state, action) => {
        console.error("Error inserting note:", action.payload);
        console.log("State before insertion", state);
      })
      .addCase(updateUserInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const updatedUser = action.payload[0] as userData;
          if (updatedUser.id) {
            state.user[updatedUser.id] = updatedUser;
          }
        } else {
          console.error("Payload format is not as expected:", action.payload);
        }
      })
      .addCase(updateUserInDB.rejected, (state, action) => {
        console.error("Error updating note:", action.payload);
        console.log("State before updation", state);
      })
      .addCase(deleteUserInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const deletedNoteId = (action.payload[0] as userData)?.id;
          if (deletedNoteId) {
            delete state.user[deletedNoteId];
          }
        } else {
          console.error("Payload format is not as expected:", action.payload);
        }
      })
      .addCase(deleteUserInDB.rejected, (state, action) => {
        console.error("Error deleting task:", action.payload);
        console.log("State before deletion", state);
      });
  },
});

export const { addUser, setUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
