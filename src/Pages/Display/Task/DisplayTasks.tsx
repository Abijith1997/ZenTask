import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../Store";
import { IconCheck, IconPencil, IconTrashFilled } from "@tabler/icons-react";
import { format, formatDistanceToNow, differenceInMinutes } from "date-fns";
import { DisplayTasksProps } from "@/Interface/Types";
import { cn } from "@/lib/utils";
import {
  deleteTask,
  getDueColor,
  handleCheck,
} from "./Parts/Functions/taskFunctions";
import { GeminiSVG } from "@/SVG/SVGs";
import { GeminiHTMLViewer } from "./Parts/GeminiParser";
import {
  handleGeminiSave,
  invokeGemini,
} from "./Parts/Functions/GeminiFunctions";
import { TagRenderer } from "./Parts/TagRenderer";

export const DisplayTasks = ({
  task,
  checked,
  setChecked,
  clicked,
  setClicked,
  setSelectedItem,
  setSelectedTask,
}: DisplayTasksProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [borderColor, setBorderColor] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (task?.Tags) {
      setTags(String(task.Tags).split(","));
    } else {
      setTags([]);
    }
  }, [task?.Tags]);
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
    task.Priority === "High"
      ? setBorderColor("border-l-5 border-red-400")
      : task.Priority === "Medium"
      ? setBorderColor("border-l-5 border-orange-400")
      : task.Priority === "Low"
      ? setBorderColor("border-l-5 border-yellow-500")
      : setBorderColor("border-primary");
  });

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

  const handleEdit = () => {
    setSelectedItem("newTask");
    setClicked(!clicked);
    setSelectedTask(task);
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

  const handleDelete = () => {
    deleteTask(task.id, dispatch);
  };

  return (
    <div
      className="outer-display-task w-full flex items-center justify-center sm:p-2 transition-all duration-300 ease-in-out text-[var(--text-color)] sm:gap-5 gap-2"
      ref={outerRef}
    >
      <div
        className="hidden sm:flex relative gemini-svg w-auto h-auto rounded-3xl p-[4px] sm:p-1 z-0 cursor-pointer transition-transform duration-300 ease-in-out sm:hover:scale-110 shadow-lg "
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
        <div className="gemini-svg-inner w-[25px] sm:w-[22px] z-10 bg-gray-200 sm:rounded-3xl rounded-full p-1">
          <GeminiSVG />
        </div>
      </div>

      <div
        className={cn(
          "display-task px-5 break-inside-avoid flex flex-col justify-start items-start rounded-[12px] w-[90%]  transition-all duration-300 ease-in-out cursor-pointer relative z-0 hover:shadow-md hover:scale-[1.01] max-w-full border-1 border-black shadow-md",
          borderColor
        )}
        ref={innerRef}
      >
        <div
          ref={editorRef}
          className="individual-task flex items-center justify-center w-full py-5 z-[-1] h-auto gap-5"
          onDoubleClick={() => handleEdit()}
        >
          <div className="title-description-container flex flex-col z-0 w-full gap-2">
            <div className="title-description w-full !text-[var(--text-color)] flex flex-col gap-1">
              <h1
                className={cn(
                  "task-title break-words uppercase !text-xs sm:!text-xl font-bold",
                  checked ? "line-through" : ""
                )}
              >
                {task.Title}
              </h1>
              {task.description && (
                <p className="text-sm">{task.description}</p>
              )}
              {task.Due &&
                (() => {
                  const dueDate = new Date(task.Due);
                  const minutesUntilDue = differenceInMinutes(
                    dueDate,
                    new Date()
                  );
                  const color = getDueColor({ minutesUntilDue, checked });

                  return (
                    <p className={cn("text-[12px]", color)}>
                      ⏰ Due {formatDistanceToNow(dueDate, { addSuffix: true })}
                      {", "}
                      {format(dueDate, "dd MMM, hh:mm a")}
                    </p>
                  );
                })()}
              <div className="tags">
                <TagRenderer tags={tags} />
              </div>
            </div>
          </div>
          <div className="manipulation-group  flex items-center justify-center flex-col gap-5">
            <div>
              <div className="delete-task relative flex items-center justify-center gap-0">
                <button
                  className="edit-button duration-300 ease-in-out transition-all scale-100 w-10"
                  onClick={() => handleEdit()}
                >
                  <IconPencil className="edit-icon" size={15} />
                </button>

                <button
                  className="delete-button w-10 duration-300 ease-in-out transition-all scale-100"
                  onClick={handleDelete}
                >
                  <IconTrashFilled className="delete-icon" size={15} />
                </button>

                <div
                  className="toggle-checkbox relative w-auto gap-4 h-full flex items-center justify-between hover:opacity-100"
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                >
                  <span
                    className="done-toggle-display rounded-sm border border-black flex items-center justify-center mr-2 ml-2 p-[1px]"
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
