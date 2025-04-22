import { IconNote, IconSquarePlus } from "@tabler/icons-react";
import { useState } from "react";

import { Note } from "@/Interface/Types";
import { Button } from "@/components/ui/button";
import { FloatingContainer } from "./Floating";

export const CreateNew = () => {
  const note = {} as Note;
  const [clicked, setClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleNew = (event: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    const targetClassList = event.currentTarget.classList; // Get the clicked button's class

    if (targetClassList.contains("new-note-button")) {
      setSelectedItem("newNote");
    } else if (targetClassList.contains("new-task-button")) {
      setSelectedItem("newTask");
    }
  };

  return (
    <>
      <div className="create-new-collapse flex gap-3">
        <Button className="extra-button new-task-button " onClick={handleNew}>
          <div className="button-inner flex justify-center items-center gap-2">
            <div className="icon-plus-container" style={{ display: "flex" }}>
              <IconSquarePlus size={20} stroke={1.5} />
            </div>
            <p>New Task</p>
          </div>
        </Button>
        <Button className="extra-button new-note-button" onClick={handleNew}>
          <div className="button-inner flex justify-center items-center gap-2">
            <div className="icon-plus-container" style={{ display: "flex" }}>
              <IconNote size={20} stroke={1.5} />
            </div>
            <p>New Note</p>
          </div>
        </Button>
      </div>
      {clicked && (
        <div className="for-floating">
          <FloatingContainer
            clicked={clicked}
            setClicked={setClicked}
            note={note}
            selectedItem={selectedItem}
          />
        </div>
      )}
    </>
  );
};
