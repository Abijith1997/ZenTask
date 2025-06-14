import { setTasks } from "@/Slices/TodoSlice";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LeftBar } from "../Leftbar/Leftbar";
import { Navbar } from "../Navbar/Navbar";
import { MainApp } from "./MainApp/MainApp";
import { NotePage } from "./MainApp/NotePage/NotePage";
import { setNotes } from "@/Slices/NoteSlice";
import { setUser } from "@/Slices/UserSlice";
import { useNavigate } from "react-router-dom";

export const Home = ({ user }: { user: User }) => {
  const [currentPage, setCurrentPage] = useState<string>("Main");
  const [filterActive, isFilterActive] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      dispatch(setNotes(data));
    };

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // instead of .single()

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (!data) {
        console.warn("No user found, redirecting...");
        navigate("/get-details"); // or any fallback route
        return;
      }

      dispatch(setUser(data));
    };

    getTasks();
    fetchNotes();
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const mainApp = document.querySelector(".main-app");
    const NotePage = document.querySelector(".note-page");

    switch (currentPage) {
      case "Main": {
        NotePage?.classList.add("inactive");
        mainApp?.classList.remove("inactive");
        break;
      }
      case "Note": {
        NotePage?.classList.remove("inactive");
        mainApp?.classList.add("inactive");
        break;
      }
      case "Profile": {
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        break;
      }
      default:
        NotePage?.classList.add("inactive");
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
            currentPage={currentPage}
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
              user={user}
              filterCategory={filterCategory}
              filterActive={filterActive}
            />
          ) : currentPage === "Note" ? (
            <NotePage />
          ) : null}
        </div>
      </div>
    </div>
  );
};
