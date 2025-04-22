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
    <div className="home-view flex gap-5 flex-col items-center justify-start p-5 h-full w-full">
      <h1 className="home-title text-center font-bold underline tracking-[0.1rem] uppercase !text-3xl">
        Your Day
      </h1>
      <div className="inside-home flex w-full h-full items-start justify-center">
        <div className="flex task-whole-list flex-col  justify-start items-center w-full h-full flex-1">
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
            <li>No tasks found</li>
          )}
        </div>
      </div>
    </div>
  );
};
