import { deleteNoteInDB, pinNoteInDB } from "@/Slices/NoteSlice";

export const deleteNoteFunction = async (
  id: `${string}-${string}-${string}-${string}-${string}`,
  dispatch: any
) => {
  try {
    const result = await dispatch(deleteNoteInDB(id));

    if (result.error) {
      console.error("Error deleting task:", result.error.message);
    } else {
    }
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};

export const pinNoteFunction = async (
  id: `${string}-${string}-${string}-${string}-${string}`,
  dispatch: any,
  pin: boolean
) => {
  try {
    const result = await dispatch(pinNoteInDB({ id, pin }));

    if (result.error) {
      console.error("Error pinning task:", result.error.message);
      console.log("Pinned the note");
    }
  } catch (error) {
    console.error("Failed to pin task:", error);
  }
};
