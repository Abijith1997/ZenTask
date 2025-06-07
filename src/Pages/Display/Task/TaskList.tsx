import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { IconCaretDown } from "@tabler/icons-react";
import { Task } from "@/Interface/Types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { getAndSetTasks } from "./GetAndSetTasks";
import { useSelector } from "react-redux";
import { RootState } from "@/Store";

interface TaskListProps {
  user: User;
  clicked: boolean;
  setClicked: (value: boolean) => void;
  setSelectedItem: (value: string | null) => void;
  setSelectedTask: (value: Task | undefined) => void;
  filterCategory: string;
  filterActive: boolean;
}

export const TaskList = ({
  user,
  clicked,
  setClicked,
  setSelectedItem,
  setSelectedTask,
  filterCategory,
  filterActive,
}: TaskListProps) => {
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    console.log(filterCategory, "From Slice");
    const afterFilter = tasks.filter((task) =>
      Object.values(task.Tags || {}).includes(filterCategory)
    );
    console.log(afterFilter);
    setFilteredTasks(afterFilter);

    const match = filteredTasks.some((task) =>
      Object.values(task.Tags || {}).includes(filterCategory)
    );

    console.log("Does any task match the filter category?", match);
    console.log(filterActive, "Filter Active State");
  }, [filterActive, filterCategory]);

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [incompletedTasks, setIncompleteTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    getAndSetTasks({
      user,
      setCompletedTasks,
      setIncompleteTasks,
    });
  }, [user, tasks]);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="task-whole-list  justify-start  flex flex-col gap-0 w-full items-center">
      <div className="whole-task-list w-full  flex flex-col gap-2 items-center justify-center">
        {filterActive ? (
          filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <DisplayTasks
                clicked={clicked}
                setClicked={setClicked}
                key={task.id}
                task={task}
                checked={checkedMap[task.id] || false}
                setChecked={(value: boolean) =>
                  handleSetChecked(task.id, value)
                }
                setSelectedItem={setSelectedItem}
                setSelectedTask={setSelectedTask}
              />
            ))
          ) : (
            <li>No tasks found with the selected Tag</li>
          )
        ) : null}
        {!filterActive && incompletedTasks.length > 0 ? (
          incompletedTasks.map((task) => (
            <DisplayTasks
              clicked={clicked}
              setClicked={setClicked}
              key={task.id}
              task={task}
              checked={checkedMap[task.id] || false}
              setChecked={(value: boolean) => handleSetChecked(task.id, value)}
              setSelectedItem={setSelectedItem}
              setSelectedTask={setSelectedTask}
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
            <div className="whole-task-list w-full flex flex-col gap-2 items-center justify-center">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <DisplayTasks
                    clicked={clicked}
                    setClicked={setClicked}
                    key={task.id}
                    task={task}
                    setSelectedItem={setSelectedItem}
                    setSelectedTask={setSelectedTask}
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
