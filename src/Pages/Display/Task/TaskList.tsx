import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { IconCaretDown } from "@tabler/icons-react";
import { Task, TaskListProps } from "@/Interface/Types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { getAndSetTasks } from "./GetAndSetTasks";
import { useSelector } from "react-redux";
import { RootState } from "@/Store";
import { SortTasks } from "./Parts/SortTasks";
import { sortTasks } from "./Parts/Functions/SortTasksFunction";

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
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [incompletedToDisplay, setIncompletedToDisplay] = useState<Task[]>([]);
  const [completedToDisplay, setCompletedToDisplay] = useState<Task[]>([]);
  const [incompletedTasks, setIncompleteTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [sortCriterion, setSortCriterion] = useState<string>("priorityDesc");

  useEffect(() => {
    getAndSetTasks({
      user,
      setCompletedTasks,
      setIncompleteTasks,
    });
  }, [user, tasks]);

  useEffect(() => {
    setIncompletedToDisplay(incompletedTasks);
    setCompletedToDisplay(completedTasks);
  }, [incompletedTasks, completedTasks]);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (!filterActive || filterCategory === "all") {
      setIncompletedToDisplay(incompletedTasks);
      return;
    }
    const incompletedAfterFilter = incompletedTasks.filter((task) =>
      Object.values(task.Tags || {}).includes(filterCategory)
    );
    setIncompletedToDisplay(incompletedAfterFilter);
  }, [filterCategory]);

  useEffect(() => {
    sortTasks({
      tasks: incompletedToDisplay,
      setTasksToDisplay: setIncompletedToDisplay,
      sortCriterion,
    });
  }, [sortCriterion, incompletedToDisplay]);

  useEffect(() => {
    sortTasks({
      tasks: completedToDisplay,
      setTasksToDisplay: setCompletedToDisplay,
      sortCriterion,
    });
  }, [sortCriterion, completedToDisplay]);

  return (
    <div className="task-whole-list  justify-start  flex flex-col gap-0 w-full items-center z-10">
      <div className="sort-ddm align-center items-end justify-end w-full flex">
        <SortTasks
          setSortCriterion={setSortCriterion}
          sortCriterion={sortCriterion}
        />
      </div>
      <div className="whole-task-list w-full  flex flex-col gap-2 items-center justify-center">
        {incompletedToDisplay.length > 0 &&
          incompletedToDisplay.map((task) => (
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
          ))}
        !!!!!!!!!!!!!!!!!
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
              {completedToDisplay.length > 0 ? (
                completedToDisplay.map((task) => (
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
