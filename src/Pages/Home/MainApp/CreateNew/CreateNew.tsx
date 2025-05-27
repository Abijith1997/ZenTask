import { IconNote, IconSquarePlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { handleNew } from "./AddNew/Functions";

interface CreateNewProps {
  setSelectedItem: (item: string | null) => void;
  setClicked: (clicked: boolean) => void;
  clicked: boolean;
  selectedItem: string | null;
}

export const CreateNew = ({ setSelectedItem, setClicked }: CreateNewProps) => {
  return (
    <>
      <div className="create-new-collapse flex gap-3">
        <Button
          className="extra-button new-task-button "
          onClick={(e) => handleNew({ setSelectedItem, setClicked, event: e })}
        >
          <div className="button-inner flex justify-center items-center gap-2">
            <div className="icon-plus-container" style={{ display: "flex" }}>
              <IconSquarePlus size={20} stroke={1.5} />
            </div>
            <p>New Task</p>
          </div>
        </Button>
        <Button
          className="extra-button new-note-button"
          onClick={(e) => handleNew({ setSelectedItem, setClicked, event: e })}
        >
          <div className="button-inner flex justify-center items-center gap-2">
            <div className="icon-plus-container" style={{ display: "flex" }}>
              <IconNote size={20} stroke={1.5} />
            </div>
            <p>New Note</p>
          </div>
        </Button>
      </div>
    </>
  );
};
