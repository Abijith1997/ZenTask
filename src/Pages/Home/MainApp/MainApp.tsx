import { Task } from "@/Interface/Types";
import { Gemini } from "./HomeView/Gemini/Gemini";
import { HomeView } from "./HomeView/HomeView";
import { CreateNew } from "./CreateNew/CreateNew";

interface MainAppProps {
  homeTasks: Task[];
}

export const MainApp = ({ homeTasks }: MainAppProps) => {
  return (
    <div
      className="main-app
    flex flex-col items-start justify-start box-border mt-16 min-h-[100dvh] top-0 right-0 ml-24 w-[calc(100%_-_6rem)] overflow-y-auto p-10
    "
    >
      <div className="in-main-app flex flex-col items-center justify-start min-w-full box-border flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
        <Gemini homeTasks={homeTasks} />

        <div className="create-new-container flex items-center justify-start gap-5 w-full pl-[10px] relative">
          <CreateNew />
        </div>
        <div className="home-view-container flex flex-col items-center justify-center w-full h-full">
          <HomeView homeTasks={homeTasks} />
        </div>
      </div>
    </div>
  );
};
