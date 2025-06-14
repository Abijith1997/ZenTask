import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
// import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  IconFilter,
  IconHome,
  IconList,
  IconLogout,
  IconMenu2,
  IconNote,
  IconNotes,
  IconSearch,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { handleNavigation } from "../Functions/Functions";
import { useEffect, useRef, useState } from "react";
import { NavbarProps, Note, Task } from "@/Interface/Types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/Store";
import { FloatingContainer } from "../Home/MainApp/CreateNew/Floating";
import { ProfileView } from "../Profile/Profile";

export const Navbar = ({ user, setCurrentPage }: NavbarProps) => {
  const [clicked, setClicked] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterOptionsRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const notes = useSelector((state: RootState) => state.note.notes);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [onlyNotes, setOnlyNotes] = useState<boolean>(false);
  const [onlyTasks, setOnlyTasks] = useState<boolean>(false);
  const [note, setNote] = useState<Note | undefined>(undefined);
  const svgColor = "#1c1d16";
  const [open, setOpen] = useState(false);
  const [openDDM, setOpenDDM] = useState(false);
  const navigate = useNavigate();
  const [profileOpened, setProfileOpened] = useState<boolean>(false);
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully!");
      navigate("/login");
    }
  };

  const callHandleNavigation = (page: string) => {
    handleNavigation({ page, setCurrentPage });
    setOpen(false);
  };

  const handleProfile = () => {
    setProfileOpened(true);
    setOpen(false);
    setOpenDDM(false);
  };

  useEffect(() => {
    if (searchQuery) {
      const tempTasks = tasks.filter(
        (task) =>
          task.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(tempTasks.length > 0 ? tempTasks : []);
      const tempNotes = notes.filter(
        (note) =>
          note.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.Content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Filtered notes:", tempNotes);
      setFilteredNotes(tempNotes.length > 0 ? tempNotes : []);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!searchActive) return;
    const deactivateSearch = () => {
      setSearchActive(false);
      setSearchQuery("");
      setFilteredTasks([]);
      setFilteredNotes([]);
      setSelectedItem(null);
      setFilterOpen(false);
      setOnlyNotes(false);
      setOnlyTasks(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        deactivateSearch();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const filterButton = filterRef.current;
      const filterOptions = filterOptionsRef.current;
      const isOutsideSearch =
        searchRef.current &&
        !searchRef.current.contains(target) &&
        !filterButton?.contains(target) &&
        !filterOptions?.contains(target);
      if (isOutsideSearch) {
        deactivateSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 300);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchActive]);

  const handleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleSearchClose = () => {
    document.querySelector(".search-input")?.classList.toggle("hidden");
    setSearchActive(!searchActive);
    setSearchQuery("");
    setFilteredTasks([]);
    setFilteredNotes([]);
    setSelectedItem(null);
    setFilterOpen(false);
    setOnlyNotes(false);
    setOnlyTasks(false);
  };

  useEffect(() => {
    onlyNotes && setFilteredTasks([]);
    onlyTasks && setFilteredNotes([]);
  }, [onlyNotes, onlyTasks]);

  return (
    <>
      {profileOpened && (
        <div className="fixed top-[50%] h-screen w-screen left-[50%] -translate-x-1/2 -translate-y-1/2">
          <ProfileView
            user={user}
            profileOpened={profileOpened}
            setProfileOpened={setProfileOpened}
          />
        </div>
      )}
      <FloatingContainer
        clicked={clicked}
        setSelectedTask={setSelectedTask}
        setClicked={setClicked}
        selectedItem={selectedItem}
        selectedTask={selectedTask}
        note={note}
      />
      <div className="top-navbar bg-sidebar flex flex-row justify-end items-center h-[4rem] text-amber-50 w-full z-50 sticky border-b-2 border-border">
        <div className="sm:hidden search-mobile">
          <div
            className={cn(
              "search-group flex items-center mr-5",
              searchActive ? "relative bg-red-50" : ""
            )}
          >
            {searchActive ? (
              <div
                className=" flex items-center justify-center gap-2 absolute right-3 top-1/2 -translate-y-1/2 z-10 text-black"
                ref={filterRef}
              >
                <IconX
                  size={16}
                  color={"#6f6f6f"}
                  className=" cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => {
                    handleSearchClose();
                  }}
                />
                {onlyTasks && onlyNotes ? (
                  <p className="rounded-full bg-gray-400 w-6 h-6 text-xs text-center flex items-center justify-center">
                    2
                  </p>
                ) : onlyTasks || onlyNotes ? (
                  <p className="rounded-full bg-gray-400 w-6 h-6 text-xs text-center flex items-center justify-center">
                    1
                  </p>
                ) : null}
                <IconFilter
                  color="#6f6f6f"
                  size={16}
                  className=" cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => handleFilter()}
                />
              </div>
            ) : (
              <IconSearch
                color={"black"}
                size={20}
                className="hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  document
                    .querySelector(".search-input")
                    ?.classList.toggle("hidden");
                  setSearchActive(!searchActive);
                }}
              />
            )}
            <Input
              ref={searchRef}
              onFocus={() => {
                setFilterOpen(false);
              }}
              id="search-input"
              className={cn(
                " absolute -translate-x-[100%] transition-all duration-300 ease-in-out transform mr-5 h-8 bg-background text-primary placeholder:text-primary placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary rounded-md",
                searchActive
                  ? "opacity-100 scale-100 w-[20rem] sm:w-[25rem]"
                  : "opacity-0 scale-0 hidden"
              )}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {filterOpen && (
              <div
                ref={filterOptionsRef}
                className="filter-options flex-col flex gap-2 absolute bottom-0 translate-y-[120%] right-0 w-auto z-100 bg-background rounded-md p-2 shadow-md"
              >
                <Button
                  variant={"ghost"}
                  className={cn(
                    "text-black border-1 hover:bg-gray-200 transition-colors duration-300 ease-in-out",
                    onlyTasks ? "bg-gray-300" : ""
                  )}
                  onClick={() => {
                    setOnlyTasks(!onlyTasks);
                  }}
                >
                  Task
                </Button>
                <Button
                  className={cn(
                    "text-black border-1 hover:bg-gray-200 transition-colors duration-300 ease-in-out",
                    onlyNotes ? "bg-gray-300" : ""
                  )}
                  variant={"ghost"}
                  onClick={() => {
                    setOnlyNotes(!onlyNotes);
                  }}
                >
                  Notes
                </Button>
              </div>
            )}
            {searchActive && searchQuery && (
              <div className="filtered absolute top-[2.5rem] right-0 w-[20rem] sm:w-[25rem] z-50 shadow-md bg-background rounded-md p-2 overflow-y-auto max-h-[400px]">
                {filteredTasks.length > 0 &&
                  searchQuery &&
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setSelectedItem("newTask");
                        setClicked(true);
                        setSelectedTask(task);
                        setSearchActive(false);
                        setSearchQuery("");
                        setFilteredTasks([]);
                      }}
                      className={cn(
                        "filtered-task-item border-b-1 w-full p-2 flex gap-2 items-center justify-start mb-0.5 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ease-in-out",
                        task.Priority === "High"
                          ? "border-l-red-400 border-l-1"
                          : task.Priority === "Medium"
                          ? "border-l-orange-400"
                          : task.Priority === "Low"
                          ? "border-l-yellow-500"
                          : null
                      )}
                    >
                      <IconList color="black" size={16} />
                      <p className="text-primary">{task.Title}</p>
                    </div>
                  ))}
                {filteredNotes.length > 0 &&
                  searchQuery &&
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedItem("newNote");
                        setClicked(true);
                        setSearchActive(false);
                        setNote(note);
                        setSearchQuery("");
                        setFilteredNotes([]);
                        setFilteredTasks([]);
                      }}
                      className="filtered-note-item flex gap-2 items-center justify-start border-b-1 w-full p-2 mb-0.5 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                    >
                      <IconNote color="black" size={16} />
                      <p className="text-primary">{note.Title}</p>
                    </div>
                  ))}
                {filteredTasks.length === 0 && filteredNotes.length === 0 && (
                  <div className="no-results text-center text-gray-500 p-2">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="sm:flex justify-center items-center pr-[0.5rem] hidden">
          <div
            className={cn(
              "search-group flex items-center mr-5",
              searchActive ? "relative bg-red-50" : ""
            )}
          >
            {searchActive ? (
              <div
                className=" flex items-center justify-center gap-2 absolute right-3 top-1/2 -translate-y-1/2 z-10 text-black"
                ref={filterRef}
              >
                <IconX
                  size={16}
                  color={"#6f6f6f"}
                  className=" cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => {
                    handleSearchClose();
                  }}
                />
                {onlyTasks && onlyNotes ? (
                  <p className="rounded-full bg-gray-400 w-6 h-6 text-xs text-center flex items-center justify-center">
                    2
                  </p>
                ) : onlyTasks || onlyNotes ? (
                  <p className="rounded-full bg-gray-400 w-6 h-6 text-xs text-center flex items-center justify-center">
                    1
                  </p>
                ) : null}
                <IconFilter
                  color="#6f6f6f"
                  size={16}
                  className=" cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => handleFilter()}
                />
              </div>
            ) : (
              <IconSearch
                color={"black"}
                size={20}
                className="hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  document
                    .querySelector(".search-input")
                    ?.classList.toggle("hidden");
                  setSearchActive(!searchActive);
                }}
              />
            )}
            <Input
              ref={searchRef}
              onFocus={() => {
                setFilterOpen(false);
              }}
              id="search-input"
              className={cn(
                " absolute -translate-x-[100%] transition-all duration-300 ease-in-out transform mr-5 h-8 bg-background text-primary placeholder:text-primary placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary rounded-md",
                searchActive
                  ? "opacity-100 scale-100 w-[20rem] sm:w-[25rem]"
                  : "opacity-0 scale-0 hidden"
              )}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {filterOpen && (
              <div
                ref={filterOptionsRef}
                className="filter-options flex-col flex gap-2 absolute bottom-0 translate-y-[120%] right-0 w-auto z-100 bg-background rounded-md p-2 shadow-md"
              >
                <Button
                  variant={"ghost"}
                  className={cn(
                    "text-black border-1 hover:bg-gray-200 transition-colors duration-300 ease-in-out",
                    onlyTasks ? "bg-gray-300" : ""
                  )}
                  onClick={() => {
                    setOnlyTasks(!onlyTasks);
                  }}
                >
                  Task
                </Button>
                <Button
                  className={cn(
                    "text-black border-1 hover:bg-gray-200 transition-colors duration-300 ease-in-out",
                    onlyNotes ? "bg-gray-300" : ""
                  )}
                  variant={"ghost"}
                  onClick={() => {
                    setOnlyNotes(!onlyNotes);
                  }}
                >
                  Notes
                </Button>
              </div>
            )}
            {searchActive && searchQuery && (
              <div className="filtered absolute top-[2.5rem] right-0 w-[20rem] sm:w-[25rem] z-50 shadow-md bg-background rounded-md p-2 overflow-y-auto max-h-[400px]">
                {filteredTasks.length > 0 &&
                  searchQuery &&
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setSelectedItem("newTask");
                        setClicked(true);
                        setSelectedTask(task);
                        setSearchActive(false);
                        setSearchQuery("");
                        setFilteredTasks([]);
                      }}
                      className={cn(
                        "filtered-task-item border-b-1 w-full p-2 flex gap-2 items-center justify-start mb-0.5 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ease-in-out",
                        task.Priority === "High"
                          ? "border-l-red-400 border-l-1"
                          : task.Priority === "Medium"
                          ? "border-l-orange-400"
                          : task.Priority === "Low"
                          ? "border-l-yellow-500"
                          : null
                      )}
                    >
                      <IconList color="black" size={16} />
                      <p className="text-primary">{task.Title}</p>
                    </div>
                  ))}
                {filteredNotes.length > 0 &&
                  searchQuery &&
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedItem("newNote");
                        setClicked(true);
                        setSearchActive(false);
                        setNote(note);
                        setSearchQuery("");
                        setFilteredNotes([]);
                        setFilteredTasks([]);
                      }}
                      className="filtered-note-item flex gap-2 items-center justify-start border-b-1 w-full p-2 mb-0.5 cursor-pointer hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                    >
                      <IconNote color="black" size={16} />
                      <p className="text-primary">{note.Title}</p>
                    </div>
                  ))}
                {filteredTasks.length === 0 && filteredNotes.length === 0 && (
                  <div className="no-results text-center text-gray-500 p-2">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* <div className="theme-container mr-[0.5rem] rounded-full">
            <ThemeToggle />
          </div> */}
          <div className="dropdown px-3">
            <DropdownMenu open={openDDM} onOpenChange={setOpenDDM}>
              <DropdownMenuTrigger asChild>
                <div className="user-ddm cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 w-10 h-10 rounded-full flex items-center justify-center flex-col">
                  <Avatar>
                    {!user?.user_metadata?.avatar_url ? (
                      <>
                        <AvatarImage
                          className="rounded-full object-cover w-full h-full"
                          src="https://github.com/evilrabbit.png"
                          alt="@evilrabbit"
                        />
                        <AvatarFallback>ER</AvatarFallback>
                      </>
                    ) : (
                      <AvatarImage
                        className="rounded-full object-cover w-10 h-10"
                        src={user?.user_metadata?.avatar_url}
                      />
                    )}
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col items-center justify-center gap-2 mr-[1rem] mt-[0.5rem] bg-secondary p-[1rem] rounded-sm w-[100%] right-10 translate-x-[-1rem]">
                <Button
                  className="flex justify-center items-center w-full settings-button"
                  onClick={() => handleProfile()}
                >
                  Settings
                </Button>
                <DropdownMenuSeparator />
                <Button
                  className="flex justify-center items-center w-full settings-button"
                  variant={"destructive"}
                  onClick={handleLogOut}
                >
                  <div className="logout-group flex items-center justify-center">
                    <IconLogout></IconLogout>
                    <p className="ml-[0.5rem]">Log out</p>
                  </div>
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="sm:hidden pr-2 mr-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={"outline"}>
                <IconMenu2 size={24} color={svgColor} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="z-400 w-[50%] [&>button]:hidden right-0 border-0"
            >
              <SheetHeader className="h-[100dvh] flex flex-col justify-between pb-5 ">
                <div className="top gap-1 flex flex-col items-center justify-center w-full ">
                  <SheetTitle className="text-primary text-xl text-center">
                    Quick Access
                  </SheetTitle>
                  <Separator className="w-full bg-primary p-0.5 rounded-md mb-2" />
                  <div className="navlinks flex items-center justify-center flex-col gap-[1rem] w-full ">
                    <a className="w-full">
                      <Button
                        variant={"outline"}
                        className="nav-button w-full flex items-center justify-center"
                        onClick={() => callHandleNavigation("Main")}
                      >
                        <div className="group-link items-center justify-center gap-[0.5rem]">
                          <IconHome color={svgColor} />
                        </div>
                        <p className="decoration-none text-sm">Home</p>
                      </Button>
                    </a>

                    <a className="w-full">
                      <Button
                        variant={"outline"}
                        className="nav-button w-full flex items-center justify-center"
                        onClick={() => callHandleNavigation("Note")}
                      >
                        <div className="group-link items-center justify-center gap-[0.5rem]">
                          <IconNotes color={svgColor} />
                        </div>
                        <p className="decoration-none text-sm">Notes</p>
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="profile-link gap-[1rem] flex items-center justify-center flex-col">
                  <Separator className="h-full w-full bg-primary p-0.5 rounded-md" />
                  <Button
                    variant={"outline"}
                    className="nav-button w-full flex items-center justify-center"
                    onClick={handleProfile}
                  >
                    <div className="group-link items-center justify-center gap-[0.5rem]">
                      <IconUser color={svgColor} />
                    </div>
                    <p className="decoration-none text-sm">Profile</p>
                  </Button>
                  <Button
                    className="flex justify-center items-center w-full settings-button"
                    variant={"destructive"}
                    onClick={handleLogOut}
                  >
                    <div className="logout-group flex items-center justify-center">
                      <IconLogout></IconLogout>
                      <p className="ml-[0.5rem]">Log out</p>
                    </div>
                  </Button>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
