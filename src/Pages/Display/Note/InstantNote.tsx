import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FloatingContainer } from "@/Pages/Home/MainApp/CreateNew/Floating";

export const InstantNote = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const selectedItem = "newNote";

  return (
    <div className="instant-note p-5 w-full flex flex-col items-center justify-center">
      <div className="note-arrow-group w-full max-w-[400px] rounded-sm relative">
        <Input
          className="instant-title text-xs h-10 border border-[rgba(0,0,0,0.1)] rounded-lg shadow-[1px_1px_5px_rgba(0,0,0,0.1)] bg-secondary"
          placeholder="Click to Add New Note..."
          onClick={() => setClicked(true)}
          readOnly
        />
      </div>
      {clicked && (
        <div className="for-floating">
          <FloatingContainer
            clicked={clicked}
            setClicked={setClicked}
            selectedItem={selectedItem} // Pass the selected item to FloatingContainer
          />
        </div>
      )}
    </div>
  );
};
