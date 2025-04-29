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
import { DisplayTasksProps } from "@/Interface/Types";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "../../Home/MainApp/CreateNew/AddNew/Task/DateTime/DateTime";
import {
  deleteTask,
  getDueColor,
  handleCheck,
  handleSave,
} from "./Parts/Functions/taskFunctions";
import { GeminiSVG } from "@/SVG/SVGs";
import { GeminiHTMLViewer } from "./Parts/GeminiParser";
import {
  handleGeminiSave,
  invokeGemini,
} from "./Parts/Functions/GeminiFunctions";

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
  const button =
    "border-1 text-xs border-background bg-background hover:border-1 transition-all hover:border-background hover:bg-secondary hover:text-primary hover:transition-all";
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [generateNew, setGenerateNew] = useState(false);

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
        handleSave({
          selectedTime,
          dispatch,
          task,
          editTitle,
          editDescription,
          setIsEditing,
        });
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleSave({
          selectedTime,
          dispatch,
          task,
          editTitle,
          editDescription,
          setIsEditing,
        });
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter")
      handleSave({
        selectedTime,
        dispatch,
        task,
        editTitle,
        editDescription,
        setIsEditing,
      });
  };

  const handleDelete = () => {
    deleteTask(task.id, dispatch);
  };

  const callHandleCheck = () => {
    handleCheck({
      checked,
      setChecked,
      task,
      tasks,
      dispatch,
    });
  };

  const callHandleGeminiSave = () => {
    handleGeminiSave({
      response,
      dispatch,
      task,
    });
  };

  const callHandleSave = () => {
    handleSave({
      selectedTime,
      dispatch,
      task,
      editTitle,
      editDescription,
      setIsEditing,
    });
  };

  return (
    <div
      className=" outer-display-task w-full flex items-center justify-center sm:p-4 transition-all duration-300 ease-in-out text-[var(--text-color)] sm:gap-5 gap-2"
      ref={outerRef}
    >
      <div
        className="relative gemini-svg w-auto h-auto rounded-3xl p-[4px] sm:p-1 z-0 cursor-pointer transition-transform duration-300 ease-in-out sm:hover:scale-110 shadow-lg "
        onClick={(e) =>
          invokeGemini({
            e,
            setGenerateNew,
            setResponse,
            setLoading,
            response,
            task,
          })
        }
      >
        <div className="gemini-svg-inner w-[25px] sm:w-[22px] z-10 bg-secondary sm:rounded-3xl rounded-full p-1">
          <GeminiSVG />
        </div>
      </div>

      <div
        className="display-task px-5 break-inside-avoid flex flex-col justify-start items-start rounded-[12px]  w-[90%]  transition-all duration-300 ease-in-out cursor-pointer relative z-10 hover:shadow-md hover:scale-[1.01] max-w-full bg-secondary"
        ref={innerRef}
      >
        <div
          ref={editorRef}
          className={cn(
            "individual-task flex items-center justify-center w-full py-5",
            {
              "h-auto": !isEditing,
              "sm:h-[200px] max-w-[100%]": isEditing,
              "gap-5": true,
              "transition-all ease-in-out duration-300": true,
            }
          )}
          onDoubleClick={() => setIsEditing(!isEditing)}
        >
          <div
            ref={editorRef}
            className={cn(
              "title-description-container flex flex-col  w-full gap-2",
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
                  className="task-title-input resize-none border-0 shadow-sm rounded-lg flex text-sm sm:p-4 p-2"
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
                    <div className="date-editor bg-red-500 rounded-lg w-[fit-content]">
                      <DateTimePicker
                        setSelectedTime={setSelectedTime}
                        selectedTime={selectedTime}
                      />
                    </div>
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
              <div className="title-description w-full !text-[var(--text-color)] text-sm sm:text-md">
                <h2
                  className={cn(
                    "task-title break-words uppercase ",
                    checked ? "line-through" : ""
                  )}
                >
                  {editTitle}
                </h2>
                {editDescription && (
                  <p className="text-xs text-white">{editDescription}</p>
                )}
                {selectedTime &&
                  (() => {
                    const dueDate = new Date(selectedTime);
                    const minutesUntilDue = differenceInMinutes(
                      dueDate,
                      new Date()
                    );
                    const color = getDueColor({ minutesUntilDue, checked });

                    return (
                      <p className={cn("text-[0.75rem]", color)}>
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
          <div className="manipulation-group  flex items-center justify-center flex-col gap-5">
            <div>
              <div className="delete-task relative flex items-center justify-center ">
                <button
                  className="edit-button duration-300 ease-in-out transition-all scale-100"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <IconX
                      className="close-icon duration-300 ease-in-out transition-all scale-100 "
                      size={15}
                    />
                  ) : (
                    <IconPencil className="edit-icon" size={15} />
                  )}
                </button>

                <button className="delete-button " onClick={handleDelete}>
                  <IconTrashFilled className="delete-icon" size={15} />
                </button>

                <div
                  className="toggle-checkbox relative w-auto gap-4 h-full flex items-center justify-between hover:opacity-100"
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                >
                  <span
                    className="done-toggle-display rounded-full border border-[var(--mantine-primary-4)] flex items-center justify-center mr-2 ml-2 p-[1px]"
                    onClick={() => callHandleCheck()}
                  >
                    <IconCheck
                      size={15}
                      className={checked ? `done-icon-true` : `done-icon-false`}
                    />
                  </span>
                </div>
              </div>
            </div>
            {isEditing && (
              <button className={button} onClick={() => callHandleSave()}>
                Save
              </button>
            )}
          </div>
        </div>

        {task.Gemini_ID && !generateNew ? (
          <GeminiHTMLViewer url={task.Gemini_ID} />
        ) : (
          <>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {response && (
                  <div className="gemini-generated flex items-end justify-between w-full px-10">
                    <div
                      className="!text-md gemini-response-diplay-task"
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                    <div className="save-gemini">
                      <button className={button} onClick={callHandleGeminiSave}>
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
