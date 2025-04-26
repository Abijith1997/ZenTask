import { User } from "@supabase/supabase-js";
import { TaskList } from "@/Pages/Display/Task/TaskList";

interface TaskpageProps {
  user: User;
}

export const TaskPage = ({ user }: TaskpageProps) => {
  return (
    <div className="task-page flex flex-col items-start justify-start box-border mt-16 min-h-[100dvh] top-0 sm:right-0 sm:ml-24 sm:w-[calc(100%_-_6rem)] overflow-y-auto p-10 w-full">
      <header className="task-header m-0">
        <p className=" text-xl sm:text-2xl">
          Welcome back,{" "}
          {user?.identities?.[0]?.identity_data?.full_name || "User"}
        </p>
        <p>Here's what's on your plate today. Let’s get things done!</p>
      </header>
      <section className="task-list-section p-6 flex flex-col items-center w-full h-auto">
        <TaskList user={user} />
      </section>
    </div>
  );
};
