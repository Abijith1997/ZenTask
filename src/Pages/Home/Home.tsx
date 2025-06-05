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
import { Profile } from "../Profile/Profile";

export const Home = ({ user }: { user: User }) => {
  const [currentPage, setCurrentPage] = useState<string>("Main");
  const [filterActive, isFilterActive] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
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
    const mainApp = document.querySelector(".main-app");
    const NotePage = document.querySelector(".note-page");
    const ProfilePage = document.querySelector(".profile-page");

    switch (currentPage) {
      case "Main": {
        NotePage?.classList.add("inactive");
        mainApp?.classList.remove("inactive");
        break;
      }
      case "Note": {
        NotePage?.classList.remove("inactive");
        mainApp?.classList.add("inactive");
        ProfilePage?.classList.add("hidden");
        break;
      }
      case "Task": {
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        ProfilePage?.classList.add("hidden");
        break;
      }
      case "Profile": {
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        ProfilePage?.classList.remove("hidden");
        break;
      }

      default:
        NotePage?.classList.add("inactive");
        ProfilePage?.classList.add("hidden");
    }
  }, [currentPage]);

  return (
    <div className="App bg-background min-h-screen flex items-start justify-start min-w-screen flex-col relative">
      <div className="in-app w-full">
        <div className="hidden sm:block fixed z-150">
          <LeftBar
            setCurrentPage={setCurrentPage}
            isFilterActive={isFilterActive}
            filterActive={filterActive}
            setFilterCategory={setFilterCategory}
            filterCategory={filterCategory}
          />
        </div>
        <div className="sticky z-100 top-0 p-[0.1rem]">
          <Navbar user={user} setCurrentPage={setCurrentPage} />
        </div>

        <div className="flex z-50 h-full">
          {loading ? (
            <div>Loading...</div>
          ) : currentPage === "Main" ? (
            <MainApp
              homeTasks={homeTasks}
              user={user}
              filterCategory={filterCategory}
              filterActive={filterActive}
            />
          ) : currentPage === "Note" ? (
            <NotePage user={user} />
          ) : currentPage === "Profile" ? (
            <Profile user={user} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
