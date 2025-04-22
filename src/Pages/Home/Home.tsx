import { Task } from "@/Interface/Types";
import { setTasks } from "@/Slices/TodoSlice";
import { RootState } from "@/Store";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftBar } from "../Leftbar/Leftbar";
import { Navbar } from "../Navbar/Navbar";
import { MainApp } from "./MainApp/MainApp";
import { NotePage } from "./MainApp/NotePage/NotePage";
import { TaskPage } from "./MainApp/TaskPage/TaskPage";

export const Home = ({ user }: { user: User }) => {
  const [currentPage, setCurrentPage] = useState<string>("Main");
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const [homeTasks, setHomeTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      const { data, error } = await supabase
        .from("Todo")
        .select()
        .eq("uid", user?.id);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        dispatch(setTasks(data));
        setLoading(false); // Set loading to false once tasks are fetched
      }
    };

    getTasks();
  }, [user]);

  useEffect(() => {
    const getHomeTasks = () => {
      const oneDay = 24 * 60 * 60 * 1000;
      const today = new Date();
      const tomorrow = new Date(today.getTime() + oneDay);
      const tomorrowTasks = tasks.filter((task: Task) => {
        if (!task.Due) return false;
        const taskDate = new Date(task.Due);
        return (
          (taskDate.getFullYear() === tomorrow.getFullYear() &&
            taskDate.getMonth() === tomorrow.getMonth() &&
            (taskDate.getDate() === tomorrow.getDate() ||
              taskDate.getDate() === today.getDate())) ||
          (taskDate < today && !task.completed)
        );
      });

      const sortByDueDate = (a: Task, b: Task) => {
        if (!a.Due) return 1;
        if (!b.Due) return -1;

        return new Date(a.Due).getTime() - new Date(b.Due).getTime();
      };

      tomorrowTasks.sort(sortByDueDate);

      const uncheckedTomorrowTasks = tomorrowTasks.filter(
        (task) => !task.completed
      );

      const checkedTomorrowTasks = tomorrowTasks.filter(
        (task) => task.completed
      );

      const reorderedTomorrowTasks = [
        ...uncheckedTomorrowTasks,
        ...checkedTomorrowTasks,
      ];
      setHomeTasks(reorderedTomorrowTasks);
    };
    getHomeTasks();
  }, [tasks]);

  useEffect(() => {
    console.log(currentPage);
  });

  useEffect(() => {
    console.log(currentPage);
    const mainApp = document.querySelector(".main-app");
    const TaskPage = document.querySelector(".task-page");
    const NotePage = document.querySelector(".note-page");
    // const CalenderPage = document.querySelector(".calender-page");

    switch (currentPage) {
      case "Main": {
        TaskPage?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        mainApp?.classList.remove("inactive");
        // CalenderPage?.classList.add("inactive");
        break;
      }
      case "Note": {
        NotePage?.classList.remove("inactive");
        TaskPage?.classList.add("inactive");
        mainApp?.classList.add("inactive");
        // CalenderPage?.classList.add("inactive");
        break;
      }
      case "Task": {
        TaskPage?.classList.remove("inactive");
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        // CalenderPage?.classList.add("inactive");
        break;
      }
      case "Calender": {
        // CalenderPage?.classList.remove("inactive");
        TaskPage?.classList.add("inactive");
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        break;
      }

      default:
        TaskPage?.classList.add("inactive");
        NotePage?.classList.add("inactive");
    }
  }, [currentPage]);

  return (
    <div className="App bg-[conic-gradient(at_top_left,_theme('colors.stone.800'),_theme('colors.stone.600'),_theme('colors.stone.900'))] min-h-screen flex items-center justify-center min-w-screen">
      <div className="in-app flex justify-flex-start items-flex-start min-w-[100dvw] min-h-[100vh] relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animated-bg hidden"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 11l3 3l8 -8" />
          <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
        </svg>

        <LeftBar setCurrentPage={setCurrentPage} />
        <Navbar user={user} />
        {loading ? (
          <div>Loading...</div>
        ) : currentPage === "Main" ? (
          <MainApp homeTasks={homeTasks} />
        ) : currentPage === "Task" ? (
          <TaskPage user={user} />
        ) : currentPage === "Note" ? (
          <NotePage user={user} />
        ) : null}
      </div>
    </div>
  );
};
