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
          className="instant-title text-xs h-10 border-1 rounded-lg shadow-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out hover:border-2 hover:border-primary"
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
            selectedItem={selectedItem}
          />
        </div>
      )}
    </div>
  );
};
