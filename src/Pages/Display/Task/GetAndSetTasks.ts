import { Task } from "@/Interface/Types";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";

interface props {
  user: User;
  setCompletedTasks: (value: Task[]) => void;
  setIncompleteTasks: (value: Task[]) => void;
}

export const getAndSetTasks = ({
  user,
  setCompletedTasks,
  setIncompleteTasks,
}: props) => {
  const getTasks = async () => {
    const { data, error } = await supabase
      .from("Todo")
      .select()
      .eq("uid", user?.id);
    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      const sortByDueDate = (a: Task, b: Task) => {
        if (!a.Due) return 1;
        if (!b.Due) return -1;

        return new Date(a.Due).getTime() - new Date(b.Due).getTime();
      };

      data.sort(sortByDueDate);
      const checkedTasks = data.filter((task) => task.completed);
      const uncheckedTasks = data.filter((task) => !task.completed);
      const reorderedTasks = [...uncheckedTasks, ...checkedTasks];
      setCompletedTasks(reorderedTasks.filter((task) => task.completed));
      setIncompleteTasks(reorderedTasks.filter((task) => !task.completed));
    }
  };
  getTasks();
};
