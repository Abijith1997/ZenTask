import { useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { Note } from "@/Interface/Types";
import { AddTask } from "./AddNew/Task/AddTask";
import { AddNote } from "./AddNew/Note/AddNote";
import { cn } from "@/lib/utils";

interface FloatingContainerProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  selectedItem: string | null;
  note?: Note;
  content?: string;
}

export const FloatingContainer = ({
  clicked,
  setClicked,
  selectedItem,
  note,
  content,
}: FloatingContainerProps) => {
  const floatref = useRef<HTMLDivElement | null>(null);
  const dateRef = useRef<HTMLDivElement | null>(null);
  const [selectingDate, setSelectingDate] = useState(false);
  const [color, setColor] = useState("bg-secondary");

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && clicked) {
        setClicked(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [clicked, setClicked]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef?.current && !dateRef.current.contains(event.target as Node)) {
        return;
      } else if (
        clicked &&
        floatref.current &&
        !floatref.current.contains(event.target as Node)
      ) {
        setClicked(false);
      }
    };

    // Delay adding event listener to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [clicked, setClicked, selectingDate]);

  const renderComponent = () => {
    switch (selectedItem) {
      case "newTask":
        return (
          <AddTask
            clicked={clicked}
            setClicked={setClicked}
            dateRef={dateRef}
            selectingDate={selectingDate}
            setSelectingDate={setSelectingDate}
          />
        );
      case "newNote":
        return (
          <AddNote
            note={note}
            clicked={clicked}
            setClicked={setClicked}
            content={content}
            color={color}
            setColor={setColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {clicked && (
        <div className="complete-floating w-screen h-screen flex items-center justify-center backdrop-blur-sm fixed top-0 left-0 z-100">
          <div
            className={cn(
              "test-page p-4 rounded-md  w-[500px] max-h-[600px] h-auto flex flex-col items-center justify-center shadow-[2px_2px_5px_rgba(0,0,0,0.3)] gap-0 relative",
              color
            )}
            ref={floatref}
          >
            <button
              onClick={() => setClicked(false)}
              className="close-button absolute top-5 right-5 close-button border-none bg-[var(--mantine-primary-5)] cursor-pointer !rounded-full transition-colors duration-300 hover:bg-accent h-10 w-10 flex items-center justify-center !p-1"
            >
              <IconX size={20} />
            </button>
            {renderComponent()}
          </div>
        </div>
      )}
    </>
  );
};
