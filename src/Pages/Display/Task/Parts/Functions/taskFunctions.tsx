import { dueColorProps, handleCheckProps } from "@/Interface/Types";
import {
  deleteTaskInDB,
  updateTaskInDB,
  updateTaskLocally,
} from "@/Slices/TodoSlice";

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

export const getDueColor = ({ minutesUntilDue, checked }: dueColorProps) => {
  if (!checked) {
    if (minutesUntilDue < 0) return "red"; // Overdue
    if (minutesUntilDue < 60) return "orange"; // Due in < 1 hour
    if (minutesUntilDue < 1440) return "yellow"; // Due within a day
    return "green"; // More than a day left
  }
};

interface handleSaveProps {
  selectedTime: string;
  dispatch: any;
  task: any;
  editTitle: string;
  editDescription: string;
  setIsEditing: (value: boolean) => void;
  tags?: string[];
  Priority: string;
}

export const handleSave = async ({
  selectedTime,
  dispatch,
  task,
  editTitle,
  editDescription,
  setIsEditing,
  Priority,
  tags,
}: handleSaveProps) => {
  setTimeout(async () => {
    try {
      const dueToUpdate = selectedTime?.trim()
        ? new Date(selectedTime).toISOString()
        : null;

      await dispatch(
        updateTaskInDB({
          id: task.id,
          updates: {
            Title: editTitle,
            description: editDescription.trim() || null,
            Due: dueToUpdate,
            Tags: tags,
            Priority: Priority,
          },
        })
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }, 100);
};

export const handleCheck = async ({
  checked,
  setChecked,
  task,
  tasks,
  dispatch,
}: handleCheckProps) => {
  const newChecked = !checked;
  setChecked(newChecked);
  const updatedTask = { ...task, completed: checked };
  const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));

  dispatch(updateTaskLocally(updatedTasks));
  try {
    await dispatch(
      updateTaskInDB({
        id: task.id,
        updates: { completed: newChecked },
      })
    );
  } catch (error) {
    setChecked(!newChecked);
    console.error("Failed to update task:", error);
  }
};
