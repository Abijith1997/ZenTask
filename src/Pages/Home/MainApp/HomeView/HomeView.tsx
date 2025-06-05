import { Task } from "@/Interface/Types";
import { TaskList } from "@/Pages/Display/Task/TaskList";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";

interface HomeViewProps {
  user: User;
  clicked: boolean;
  setClicked: (value: boolean) => void;
  setSelectedItem: (value: string | null) => void;
  setSelectedTask: (value: Task | undefined) => void;
  filterCategory: string;
  filterActive: boolean;
}

export const HomeView = ({
  user,
  clicked,
  setClicked,
  setSelectedItem,
  setSelectedTask,
  filterActive,
  filterCategory,
}: HomeViewProps) => {
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="home-view flex gap-6 flex-col items-center justify-start p-6 h-full w-full  backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
      <h1 className="home-title text-left font-extrabold tracking-wide uppercase w-full px-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 drop-shadow-sm">
        Today's Focus {user?.user_metadata.full_name || "User"}
      </h1>
      <div className="inside-home flex w-full h-full items-start justify-center">
        <section className="task-list-section sm:p-2 flex flex-col items-center w-full h-auto">
          <TaskList
            user={user}
            clicked={clicked}
            setClicked={setClicked}
            setSelectedItem={setSelectedItem}
            setSelectedTask={setSelectedTask}
            filterActive={filterActive}
            filterCategory={filterCategory}
          />
        </section>
      </div>
    </div>
  );
};
