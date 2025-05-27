import { Note, Task } from "@/Interface/Types";
import { Gemini } from "./HomeView/Gemini/Gemini";
import { HomeView } from "./HomeView/HomeView";
import { CreateNew } from "./CreateNew/CreateNew";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { CreateNewMobile } from "./CreateNew/CreateNewMobile";
import { FloatingContainer } from "./CreateNew/Floating";
import { cn } from "@/lib/utils";

interface MainAppProps {
  homeTasks: Task[];
}

export const MainApp = ({ homeTasks }: MainAppProps) => {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const note = {} as Note;
  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <div
      className="main-app
    flex flex-col items-stretch justify-start box-border 
    min-h-screen
    top-0 sm:ml-[5rem] overflow-y-auto sm:p-10 w-full
    "
    >
      <div className="in-main-app flex flex-col  items-center justify-start min-w-full box-border flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
        <Gemini homeTasks={homeTasks} />

        <div className="hidden create-new-container sm:flex items-center justify-start gap-5 w-full sm:pl-2 pl-10 relative">
          <CreateNew
            setClicked={setClicked}
            clicked={clicked}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        </div>
        <div className="home-view-container flex flex-col items-center justify-center w-full h-full">
          <HomeView homeTasks={homeTasks} />
        </div>
        <div className="fixed sm:hidden bottom-5 right-10 z-50 flex items-center justify-center">
          <div className="button-container">
            <Button
              className="!rounded-full text-white shadow-lg active:bg-accent !h-[4rem] w-[4rem]"
              onClick={() => setOpen(!open)}
            >
              <IconPlus size={20} />
            </Button>
          </div>
          <div
            className={cn(
              "opened-container absolute top-0 left-0 items-center  justify-center h-[6rem] w-[8rem] flex gap-5 transition-all duration-200 ease-in-out",
              open
                ? "opacity-100 -translate-x-1/4 -translate-y-[110%] scale-100 pointer-events-auto"
                : "opacity-0 -translate-x-1/4 -translate-y-[50%] scale-95 pointer-events-none"
            )}
          >
            <CreateNewMobile
              setClicked={setClicked}
              clicked={clicked}
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
            />
          </div>
        </div>
        {clicked && (
          <div className="for-floating z-[1000] absolute top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-sm">
            <FloatingContainer
              clicked={clicked}
              setClicked={setClicked}
              note={note}
              selectedItem={selectedItem}
            />
          </div>
        )}
      </div>
    </div>
  );
};
