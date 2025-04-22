import { deleteTaskInDB } from "@/Slices/TodoSlice";

export const deleteTask = async (
  id: `${string}-${string}-${string}-${string}-${string}`,
  dispatch: any
) => {
  try {
    // Dispatch the delete action
    const result = await dispatch(deleteTaskInDB(id));

    if (result.error) {
      console.error("Error deleting task:", result.error.message);
    } else {
    }
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};
