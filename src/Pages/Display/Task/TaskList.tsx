import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { useSelector } from "react-redux";
import { IconCaretDown } from "@tabler/icons-react";
import { RootState } from "@/Store";
import { Task } from "@/Interface/Types";
import { supabase } from "@/supabaseClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

interface TaskListProps {
  user: User;
}

export const TaskList = ({ user }: TaskListProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const [incompletedTasks, setIncompleteTasks] = useState<Task[]>(
    localTasks.filter((task) => !task.completed)
  );
  const [completedTasks, setCompletedTasks] = useState<Task[]>(
    localTasks.filter((task) => task.completed)
  );

  useEffect(() => {
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
        setLocalTasks(reorderedTasks);
        setCompletedTasks(reorderedTasks.filter((task) => task.completed));
        setIncompleteTasks(reorderedTasks.filter((task) => !task.completed)); // Set loading to false once tasks are fetched
      }
    };
    getTasks();
  }, [tasks, user]);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="task-whole-list  justify-start  flex flex-col gap-0 w-full items-center">
      <h2 className="heading-task-status text-center underline uppercase mb-2 !text-md p-2">
        Incomplete
      </h2>
      <div className="whole-task-list w-full lg:w-[60%] flex flex-col gap-2 items-center justify-center">
        {incompletedTasks.length > 0 ? (
          incompletedTasks.map((task) => (
            <DisplayTasks
              key={task.id}
              task={task}
              checked={checkedMap[task.id] || false}
              setChecked={(value: boolean) => handleSetChecked(task.id, value)}
            />
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </div>
      <Accordion type="single" collapsible asChild>
        <AccordionItem
          value="item-1"
          className="task-whole-list justify-start flex flex-col gap-0 w-full items-center"
        >
          <AccordionTrigger
            onClick={() => {
              document
                .querySelector(".caret-down-icon")
                ?.classList.toggle("open");
              document
                .querySelector(".complete-tasks")
                ?.classList.toggle("open");
            }}
          >
            <div className="collapse-group flex justify-center mb-1 w-full">
              <h2 className="heading-task-status !text-md underline uppercase text-center">
                Completed
              </h2>
              <IconCaretDown size={20} className="caret-down-icon" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="complete-tasks w-full flex flex-col gap-2 items-center justify-center overflow-hidden transition-all duration-500 ease-in-out">
            <div className="whole-task-list w-full lg:w-[60%] flex flex-col gap-2 items-center justify-center">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
