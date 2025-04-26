import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { User } from "@supabase/supabase-js";
import { IconPencil } from "@tabler/icons-react";

interface ProfilePageProps {
  user: User;
}

export const Profile = ({ user }: ProfilePageProps) => {
  const handleEdit = () => {};
  return (
    <div className="profile-page relative flex flex-col items-center justify-start box-border mt-16 min-h-[100dvh] top-0 sm:right-0 sm:ml-24 sm:w-[calc(100%_-_6rem)] overflow-y-auto p-8 sm:p-10 w-full shadow-md bg-primary text-primary">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="inner-profile relative flex flex-col gap-6 w-full  p-5 rounded-md shadow-md overflow-hidden bg-secondary">
        <div className="flex flex-col gap-6 z-10 p-10">
          <div className="flex items-center gap-6 p-5">
            <div className="user-profile-img relative w-20 h-20 rounded-full overflow-hidden group">
              <img
                src={user?.user_metadata.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />

              <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-b-full">
                <IconPencil size={24} color="white" />
              </div>
            </div>
            <Separator className="bg-primary h-full p-[1px] rounded-md shadow-2xs" />
            <p className="text-lg font-semibold">
              {user?.user_metadata.full_name || "-"}
            </p>
            <Button className="ml-auto" onClick={handleEdit}>
              <IconPencil />
            </Button>
          </div>
          <Separator className="bg-primary p-[1px] rounded-md w-full shadow-2xs" />
          <div className="flex flex-col gap-2  p-5 ">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-medium break-all">
              {user?.user_metadata.email || "-"}
            </p>
          </div>

          <Separator className="bg-primary p-[1px] rounded-md w-full shadow-2xs" />
        </div>
      </div>
    </div>
  );
};
