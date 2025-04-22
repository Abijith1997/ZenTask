import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import { Note } from "../Interface/Types";

interface NoteState {
  notes: Note[];
}

interface NoteUpdate {
  id: string;
  updates: Partial<Omit<Note, "id" | "created_at">>;
}

interface pinNote {
  id: `${string}-${string}-${string}-${string}-${string}`;
  pin: boolean;
}

const initialState: NoteState = {
  notes: [],
};

export const insertNoteInDB = createAsyncThunk(
  "notes/insertNotes",
  async (note: Note, { rejectWithValue }) => {
    if (!note) {
      return rejectWithValue("Nothing to insert.");
    }
    const { data, error } = await supabase.from("Notes").insert(note).select();
    if (error) {
      return rejectWithValue(error.message);
    }
    console.log(data, "data");
    return data;
  }
);

export const updateNoteInDB = createAsyncThunk(
  "notes/updateNoteInDB",
  async (noteUpdate: NoteUpdate, { rejectWithValue }) => {
    const { id, updates } = noteUpdate;
    if (!id || !updates) {
      return rejectWithValue("Invalid Note update data");
    }
    const { data, error } = await supabase
      .from("Notes")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const pinNoteInDB = createAsyncThunk(
  "notes/pinNoteInDB",
  async ({ id, pin }: pinNote, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue("No note id provided.");
    }

    const { data, error } = await supabase
      .from("Notes")
      .update({ Pinned: pin })
      .eq("id", id)
      .select();
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const deleteNoteInDB = createAsyncThunk(
  "notes/deleteNoteInDB",
  async (
    id: `${string}-${string}-${string}-${string}-${string}`,
    { rejectWithValue }
  ) => {
    if (!id) {
      return rejectWithValue("No note id provided.");
    }

    const { data, error } = await supabase
      .from("Notes")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    updateNote: (state, action) => {
      const updatedNote = action.payload;
      state.notes = state.notes.map((note) => {
        return note.id === updatedNote.id ? updatedNote : note;
      });
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    pinNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.map((note) => {
        if (note.id === action.payload) {
          return { ...note, Pinned: !note.Pinned };
        }
        return note;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertNoteInDB.fulfilled, (state, action) => {
        const notes = action.payload;
        if (Array.isArray(notes)) {
          state.notes = [...state.notes, ...notes];
        }
      })
      .addCase(insertNoteInDB.rejected, (state, action) => {
        console.error("Error inserting note:", action.payload);
        console.log("State before insertion", state);
      })
      .addCase(updateNoteInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const updatedNote = action.payload[0] as Note;
          const index = state.notes.findIndex(
            (note) => note.id === updatedNote.id
          );
          if (index !== -1) {
            state.notes[index] = { ...state.notes[index], ...updatedNote };
          }
        }
      })
      .addCase(updateNoteInDB.rejected, (state, action) => {
        console.error("Error updating note:", action.payload);
        console.log("State before updation", state);
      })
      .addCase(deleteNoteInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const deletedNoteId = (action.payload[0] as Note)?.id; // Supabase returns an array of the deleted task
          if (deletedNoteId) {
            state.notes = state.notes.filter(
              (task) => task.id !== deletedNoteId
            );
          }
        } else {
          console.error("Payload format is not as expected:", action.payload);
        }
      })
      .addCase(deleteNoteInDB.rejected, (state, action) => {
        console.error("Error deleting task:", action.payload);
        console.log("State before deletion", state);
      })
      .addCase(pinNoteInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const updatedNote = action.payload[0] as Note;
          const index = state.notes.findIndex(
            (note) => note.id === updatedNote.id
          );
          if (index !== -1) {
            state.notes[index] = updatedNote;
          }
        }
      })
      .addCase(pinNoteInDB.rejected, (state, action) => {
        console.error("Error pinning task:", action.payload);
        console.log("State before pinning", state);
      });
  },
});

export const { addNote, setNotes, updateNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
