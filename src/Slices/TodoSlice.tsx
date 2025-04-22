import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import { Task } from "../Interface/Types";

interface TodoState {
  tasks: Task[];
}

interface TaskUpdate {
  id: string;
  updates: Partial<Omit<Task, "id">>;
}

const initialState: TodoState = {
  tasks: [],
};

// Async thunk to insert tasks into Supabase
export const insertTasks = createAsyncThunk(
  "tasks/insertTasks",
  async (tasks: Task, { rejectWithValue }) => {
    // Validate that tasks is not empty or null
    if (!tasks) {
      return rejectWithValue("No tasks to insert.");
    }

    const { data, error } = await supabase.from("Todo").insert(tasks).select();
    if (error) {
      return rejectWithValue(error.message);
    }

    return data; // Supabase returns an array of tasks
  }
);

// Async thunk to update a task in Supabase
export const updateTaskInDB = createAsyncThunk(
  "tasks/updateTaskInDB",
  async (taskUpdate: TaskUpdate, { rejectWithValue }) => {
    const { id, updates } = taskUpdate;

    // Validate that both ID and updates are provided
    if (!id || !updates) {
      return rejectWithValue("Invalid task update data.");
    }

    const { data, error } = await supabase
      .from("Todo")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return rejectWithValue(error.message);
    }
    return data; // Supabase returns an array with the updated task
  }
);

// Async thunk to delete a task from Supabase
export const deleteTaskInDB = createAsyncThunk(
  "tasks/deleteTaskInDB",
  async (
    id: `${string}-${string}-${string}-${string}-${string}`,
    { rejectWithValue }
  ) => {
    if (!id) {
      return rejectWithValue("No task ID provided.");
    }

    const { data, error } = await supabase
      .from("Todo")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      return rejectWithValue(error.message);
    }

    return data; // Supabase returns an array with the deleted task
  }
);

// Slice for managing tasks state
const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    // Reducer to add a task directly to the state
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },

    // Reducer to set tasks from an external source
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    updateTaskLocally: (state, action) => {
      const updatedTask = action.payload;
      state.tasks = state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
    },
    deleteTaskLocally: (state, action) => {
      const taskIdToDelete = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskIdToDelete);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the result of the insertTasks async thunk
      .addCase(insertTasks.fulfilled, (state, action) => {
        const tasks = action.payload;
        // Check that tasks is an array before updating the state
        if (Array.isArray(tasks)) {
          state.tasks = [...state.tasks, ...tasks];
        }
      })
      .addCase(insertTasks.rejected, (state, action) => {
        console.error("Error inserting tasks:", action.payload);
        console.log("State before insertion", state);
      })

      // Handle the result of the updateTaskInDB async thunk
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const updatedTask = action.payload[0] as Task; // Supabase returns an array of the updated task
          const index = state.tasks.findIndex(
            (task) => task.id === updatedTask.id
          );
          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        }
      })
      .addCase(updateTaskInDB.rejected, (state, action) => {
        console.error("Error updating task:", action.payload);
        console.log("State before updation", state);
      })

      // Handle the result of the deleteTaskInDB async thunk
      .addCase(deleteTaskInDB.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const deletedTaskId = (action.payload[0] as Task)?.id; // Supabase returns an array of the deleted task
          if (deletedTaskId) {
            state.tasks = state.tasks.filter(
              (task) => task.id !== deletedTaskId
            );
          }
        }
      })
      .addCase(deleteTaskInDB.rejected, (state, action) => {
        console.error("Error deleting task:", action.payload);
        console.log("State before deletion", state);
      });
  },
});

// Export actions for dispatching
export const { addTask, setTasks, updateTaskLocally } = todoSlice.actions;

// Export the slice reducer
export default todoSlice.reducer;
