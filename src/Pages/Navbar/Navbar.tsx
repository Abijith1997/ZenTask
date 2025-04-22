import { supabase } from "@/supabaseClient";
import { LogoSVG } from "@/SVG/SVGs";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { IconLogout } from "@tabler/icons-react";

export const Navbar = ({ user }: { user: User }) => {
  const svgColor = "#e9ecef";
  // const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully!");
      navigate("/");
    }
  };
  const handleNavigation = () => {
    // setProfileOpen(true);
  };

  return (
    <>
      <div className="top-navbar flex flex-row justify-between items-center h-[4rem] fixed bg-background text-amber-50 top-0 right-0 w-[calc(100%_-_6rem)] z-[100]">
        <div className="flex items-center justify-center text-sm pl-[1rem]">
          <div
            className="w-7 h-7 [&>*]:w-full [&>*]:h-full flex
  items-center justify-center
  ml-[1rem]"
          >
            <LogoSVG fillColor={svgColor} />
          </div>

          <h1 className="ml-[1rem]">ZenTask</h1>
        </div>
        <div className="flex justify-center items-center pr-[0.5rem]">
          <div className="theme-container mr-[0.5rem] rounded-full">
            <ThemeToggle />
          </div>
          <div className="dropdown p-3">
            <DropdownMenu>
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
                  onClick={handleNavigation}
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
      </div>
    </>
  );
};
