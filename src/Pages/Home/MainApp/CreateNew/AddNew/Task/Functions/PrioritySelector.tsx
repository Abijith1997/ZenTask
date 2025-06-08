import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { PrioritySelectorProps } from "@/Interface/Types";

export const PrioritySelector = ({
  Priority,
  setPriority,
  priorityBg,
}: PrioritySelectorProps) => {
  return (
    <div className="priority-selector opacity-100">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`${priorityBg} w-[130px]`}>
            {Priority}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[130px] h-auto shadow-md rounded-md py-2 opacity-100 bg-background z-[1000] backdrop-blur-none"
          align="start"
        >
          <DropdownMenuGroup className="flex gap-1 flex-col items-center justify-center px-2">
            <DropdownMenuItem
              className="rounded-md hover:border-1 w-full items-center flex justify-center hover:text-white hover:bg-red-400 h-8 select-none"
              onClick={() => setPriority("High")}
            >
              High
            </DropdownMenuItem>

            <DropdownMenuItem
              className="rounded-md hover:border-1 w-full items-center flex justify-center hover:text-white hover:bg-orange-300 h-8 select-none"
              onClick={() => setPriority("Medium")}
            >
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-md hover:border-1 w-full items-center flex justify-center hover:bg-yellow-200 hover:text-black h-8 select-none"
              onClick={() => setPriority("Low")}
            >
              Low
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-md hover:border-1 w-full items-center flex justify-center h-8 select-none"
              onClick={() => setPriority("None")}
            >
              None
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
