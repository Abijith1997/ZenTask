import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  IconHome,
  IconListCheck,
  IconLogout,
  IconMenu2,
  IconNotes,
  IconUser,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { handleNavigation } from "../Functions/Functions";
import { useState } from "react";

interface NavbarProps {
  user: User | null;
  setCurrentPage: (value: string) => void;
}

export const Navbar = ({ user, setCurrentPage }: NavbarProps) => {
  const svgColor = "#1c1d16";
  const [open, setOpen] = useState(false);
  const [openDDM, setOpenDDM] = useState(false);
  // const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
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
    setCurrentPage("Profile");
    setOpen(false);
    setOpenDDM(false);
  };

  return (
    <>
      <div className="top-navbar bg-sidebar flex flex-row justify-end items-center h-[4rem] text-amber-50 w-full z-50 sticky border-b-2 border-border">
        <div className="sm:flex justify-center items-center pr-[0.5rem] hidden">
          <div className="theme-container mr-[0.5rem] rounded-full">
            <ThemeToggle />
          </div>
          <div className="dropdown p-3">
            <DropdownMenu open={openDDM} onOpenChange={setOpenDDM}>
              <DropdownMenuTrigger asChild>
                <div className="user-ddm cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 w-[2.2rem] rounded-full">
                  <Avatar>
                    <AvatarImage
                      className="rounded-full object-cover w-full h-full"
                      src={user?.user_metadata?.avatar_url}
                    />
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
                        className="nav-button w-full justify-center flex items-center"
                        onClick={() => callHandleNavigation("Task")}
                      >
                        <div className="group-link items-center justify-center gap-[0.5rem]">
                          <IconListCheck color={svgColor} />
                        </div>
                        <p className="decoration-none text-sm">Tasks</p>
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
