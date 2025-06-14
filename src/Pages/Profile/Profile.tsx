import { Button } from "@/components/ui/button";
import { ProfilePageProps } from "@/Interface/Types";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import "./profile.css";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const ProfileView = ({
  user,
  profileOpened,
  setProfileOpened,
}: ProfilePageProps) => {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (profileOpened) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [[profileOpened]]);

  const handleClose = () => {
    console.log("Closing profile");
    setProfileOpened(false);
  };

  return (
    <>
      {profileOpened && (
        <div className="complete-floating w-screen h-screen flex items-center justify-center backdrop-blur-[1px] fixed top-0 left-0 z-100">
          <div className="inner-profile relative rounded-md p-2 h-[50dvh] w-[50dvw] items-start flex justify-center border-2 flex-col bg-background shadow-md">
            <div className="justify-end w-full flex px-1">
              <Button
                onClick={handleClose}
                className="!h-10 !w-10 !rounded-full bg-background border-1 border-background  hover:text-red-700 transition-colors duration-300 ease-in-out hover:bg-background text-black cursor-pointer"
              >
                <IconX size={16} />
              </Button>
            </div>
            <div className="flex flex-col flex-1 w-full bg-secondary/30 p-2 rounded-md overflow-hidden">
              <div className="flex items-center gap-6 p-5 border-b-2 border-black/10">
                <div className="user-profile-img relative w-20 h-20 rounded-full overflow-hidden group">
                  <img
                    src={user?.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 object-cover !rounded-full"
                  />

                  <div
                    className={cn(
                      "absolute left-0 right-0 bottom-0 h-1/2 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-b-full",
                      editing ? "opacity-100" : ""
                    )}
                  >
                    <IconPencil size={24} color="white" />
                  </div>
                </div>
                <p className="text-lg font-semibold">
                  {user?.user_metadata.full_name || "-"}
                </p>
                <Button
                  className="ml-auto bg-background border-1 border-background hover:border-black shadow-md hover:bg-background text-black hover:text-gray-900 !w-10 !h-10 !rounded-full cursor-pointer transition-colors duration-300 ease-in-out"
                  onClick={() => setEditing(!editing)}
                >
                  <IconPencil />
                </Button>
              </div>
              <div className="group flex flex-col mt-1 items-start justify-start px-3 gap-2">
                <div className="flex flex-col border-b-2 w-full border-black/10">
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  {editing ? (
                    <Input />
                  ) : (
                    <p className="text-lg font-medium break-all">
                      {user?.user_metadata.email || "-"}
                    </p>
                  )}
                </div>
                <div className="flex w-full justify-around">
                  <div className="flex flex-col border-b-2 w-full border-black/10">
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="text-lg font-medium break-all">
                      {user?.user_metadata.email || "-"}
                    </p>
                  </div>
                  <div className="flex flex-col border-b-2 w-full border-black/10">
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="text-lg font-medium break-all">
                      {user?.user_metadata.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col border-b-2 w-full border-black/10">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-medium break-all">
                    {user?.user_metadata.email || "-"}
                  </p>
                </div>
                <div className="flex flex-col border-b-2 w-full border-black/10">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-lg font-medium break-all">
                    {user?.user_metadata.email || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // <div className="fixed">
  //   <div className="inner-profile relative flex flex-col gap-6 w-full  p-5 rounded-md shadow-md overflow-hidden bg-secondary">
  //   <div className="flex flex-col gap-6 z-10 p-10">
  //     <div className="flex items-center gap-6 p-5">
  //       <div className="user-profile-img relative w-20 h-20 rounded-full overflow-hidden group">
  //         <img
  //           src={user?.user_metadata.avatar_url}
  //           alt="Avatar"
  //           className="w-full h-full object-cover rounded-full"
  //         />

  //         <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-b-full">
  //           <IconPencil size={24} color="white" />
  //         </div>
  //       </div>
  //       <Separator className="bg-primary h-full p-[1px] rounded-md shadow-2xs" />
  //       <p className="text-lg font-semibold">
  //         {user?.user_metadata.full_name || "-"}
  //       </p>
  //       <Button className="ml-auto" onClick={handleEdit}>
  //         <IconPencil />
  //       </Button>
  //     </div>
  //     <Separator className="bg-primary p-[1px] rounded-md w-full shadow-2xs" />
  //     <div className="flex flex-col gap-2  p-5 ">
  //       <p className="text-sm text-muted-foreground">Email</p>
  //       <p className="text-lg font-medium break-all">
  //         {user?.user_metadata.email || "-"}
  //       </p>
  //     </div>

  //     <Separator className="bg-primary p-[1px] rounded-md w-full shadow-2xs" />
  //   </div>
  // </div>
  // </div>
  // )
};
