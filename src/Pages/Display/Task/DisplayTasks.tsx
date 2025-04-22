import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../Store";
import {
  IconCheck,
  IconPencil,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { format, formatDistanceToNow, differenceInMinutes } from "date-fns";
import { Task } from "@/Interface/Types";
import { updateTaskInDB, updateTaskLocally } from "@/Slices/TodoSlice";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "../../Home/MainApp/CreateNew/AddNew/Task/DateTime/DateTime";
import { deleteTask } from "./taskFunctions";

interface DisplayTasksProps {
  task: Task;
  checked: boolean;
  setChecked: (value: boolean) => void;
}

export const DisplayTasks = ({
  task,
  checked,
  setChecked,
}: DisplayTasksProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.Title);
  const [editDescription, setEditDescription] = useState(
    task.description ?? ""
  );
  const [selectedTime, setSelectedTime] = useState(task.Due ?? "");
  const [showMoreFields, setShowMoreFields] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const getDueColor = (minutesUntilDue: number) => {
    if (!checked) {
      if (minutesUntilDue < 0) return "red"; // Overdue
      if (minutesUntilDue < 60) return "orange"; // Due in < 1 hour
      if (minutesUntilDue < 1440) return "yellow"; // Due within a day
      return "green"; // More than a day left
    }
  };

  useEffect(() => {
    setChecked(task.completed);
  }, [task.completed]);

  useEffect(() => {
    const taskEl = innerRef.current;
    const outerEl = outerRef.current;

    const handleMouseEnter = () => {
      outerEl?.classList.add("hovered");
    };

    const handleMouseLeave = () => {
      outerEl?.classList.remove("hovered");
    };

    if (taskEl) {
      taskEl.addEventListener("mouseenter", handleMouseEnter);
      taskEl.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (taskEl) {
        taskEl.removeEventListener("mouseenter", handleMouseEnter);
        taskEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        handleSave();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleSave();
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isEditing, editTitle, editDescription, selectedTime]);

  const handleCheck = async () => {
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

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
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
            },
          })
        );
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to update task:", err);
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  const handleDelete = () => {
    deleteTask(task.id, dispatch);
  };

  return (
    <div
      className="outer-display-task w-full flex items-center justify-center p-4 transition-all duration-300 ease-in-out text-[var(--text-color)]"
      ref={outerRef}
    >
      <div
        className="display-task p-5 break-inside-avoid flex flex-col justify-start items-start rounded-[12px] bg-secondary w-[90%] h-auto transition-all duration-300 ease-in-out cursor-pointer relative z-10 hover:shadow-md hover:scale-[1.01] "
        ref={innerRef}
      >
        <div
          ref={editorRef}
          className={cn(
            "individual-task flex items-center justify-center w-full",
            {
              "h-[4dvw]": !isEditing,
              "h-[200px]": isEditing,
              "gap-5": true,
              "transition-all ease-in-out duration-300": true,
            }
          )}
          onDoubleClick={handleEdit}
        >
          <div
            ref={editorRef}
            className={cn(
              "title-description-container flex flex-col w-full gap-2",
              {
                "transition-opacity duration-[10000ms] ease-in-out": true,
                "transition-all ease-in-out duration-300": isEditing,
                "animate-[appear-edit_0.5s_ease-in-out]": isEditing,
              }
            )}
          >
            {isEditing ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="task-title-input resize-none border-0 shadow-sm rounded-lg flex text-sm p-4"
                  autoFocus
                />

                {(editDescription || selectedTime || showMoreFields) && (
                  <>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="task-description-input resize-none border-0 shadow-sm rounded-lg flex text-sm p-4"
                      placeholder="Add description..."
                    />
                    <DateTimePicker
                      setSelectedTime={setSelectedTime}
                      selectedTime={selectedTime}
                    />
                  </>
                )}

                {!editDescription && !selectedTime && !showMoreFields && (
                  <button
                    className="more-button"
                    onClick={() => setShowMoreFields(true)}
                    title="Add description or due date"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    ⋯
                  </button>
                )}
              </>
            ) : (
              <div className="title-description w-full">
                <h2
                  className={cn(
                    "task-title break-words uppercase",
                    checked ? "line-through" : ""
                  )}
                >
                  {editTitle}
                </h2>
                {editDescription && (
                  <p className="text-xs">{editDescription}</p>
                )}
                {selectedTime &&
                  (() => {
                    const dueDate = new Date(selectedTime);
                    const minutesUntilDue = differenceInMinutes(
                      dueDate,
                      new Date()
                    );
                    const color = getDueColor(minutesUntilDue);

                    return (
                      <p className={cn("text-xs", color)}>
                        ⏰ Due{" "}
                        {formatDistanceToNow(dueDate, { addSuffix: true })}
                        {", "}
                        {format(dueDate, "dd MMM, hh:mm a")}
                      </p>
                    );
                  })()}
              </div>
            )}
          </div>
          <div className="manipulation-group flex items-center justify-center ">
            <div className="delete-task relative flex items-center justify-center gap-0">
              <button
                className="edit-button duration-300 ease-in-out transition-all scale-100"
                onClick={handleEdit}
              >
                {isEditing ? (
                  <IconX
                    className="close-icon duration-300 ease-in-out transition-all scale-100"
                    size={15}
                  />
                ) : (
                  <IconPencil className="edit-icon" size={15} />
                )}
              </button>

              <button className="delete-button" onClick={handleDelete}>
                <IconTrashFilled className="delete-icon" size={15} />
              </button>
            </div>
            <div
              className="toggle-checkbox relative w-auto gap-4 h-full flex items-center justify-between hover:opacity-100"
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
            >
              <span
                className="done-toggle-display rounded-full border border-[var(--mantine-primary-4)] flex items-center justify-center mr-2 ml-2 p-[1px]"
                onClick={handleCheck}
              >
                <IconCheck
                  size={15}
                  className={checked ? `done-icon-true` : `done-icon-false`}
                />
              </span>
            </div>
            {isEditing && (
              <button
                className="save-button focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,123,255,0.5)] px-4 py-2 border-none rounded-md text-sm cursor-pointer transition duration-200 ease-in-out transform box-shadow-md animate-appear-edit"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
