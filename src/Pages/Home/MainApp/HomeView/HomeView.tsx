import { Task } from "@/Interface/Types";
import { DisplayTasks } from "@/Pages/Display/Task/DisplayTasks";
import { useState } from "react";

interface HomeViewProps {
  homeTasks: Task[];
}

export const HomeView = ({ homeTasks }: HomeViewProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="home-view flex gap-6 flex-col items-center justify-start p-6 h-full w-full  backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
      <h1 className="home-title text-left font-extrabold tracking-wide uppercase w-full px-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 drop-shadow-sm">
        Today's Focus
      </h1>
      <div className="inside-home flex w-full h-full items-start justify-center">
        <div className="flex task-whole-list flex-col justify-start items-center w-full h-full flex-1 gap-3 px-4 py-2  rounded-lg backdrop-blur-sm  max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300/50 scrollbar-track-transparent hover:scrollbar-thumb-emerald-400/70 transition-colors">
          {homeTasks.length > 0 ? (
            homeTasks.map((task) => (
              <DisplayTasks
                key={task.id}
                task={task}
                checked={checkedMap[task.id] || false}
                setChecked={(value: boolean) =>
                  handleSetChecked(task.id, value)
                }
              />
            ))
          ) : (
            <li className="text-slate-500/80 font-medium text-lg italic py-8 px-4 bg-white/20 rounded-lg border border-dashed border-slate-300/50 backdrop-blur-sm w-full text-center">
              No tasks found - Time to add some goals! ✨
            </li>
          )}
        </div>
      </div>
    </div>
  );
};
