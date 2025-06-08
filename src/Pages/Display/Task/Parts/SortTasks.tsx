import { Button } from "@/components/ui/button";
import { SortTasksProps } from "@/Interface/Types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const SortTasks = ({
  sortCriterion,
  setSortCriterion,
}: SortTasksProps) => {
  const [displaySort, setDisplaySort] = useState<string>("Sort By");

  useEffect(() => {
    if (sortCriterion === "default") {
      setDisplaySort("Sort By");
    } else if (sortCriterion === "dateAsc") {
      setDisplaySort("Date Ascending");
    } else if (sortCriterion === "dateesc") {
      setDisplaySort("Date Descending");
    } else if (sortCriterion === "priorityAsc") {
      setDisplaySort("Priority Ascending");
    } else if (sortCriterion === "priorityDesc") {
      setDisplaySort("Priority Descending");
    }
  }, [sortCriterion]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"sm"} className="text-xs h-5">
            {sortCriterion === "default" ? "Sort By" : displaySort}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="z-[1000] w-[145px] bg-white flex flex-col gap-2 shadow-md border-1 rounded-md p-2 opacity-100 text-black hover:bg-gray-100 transition-all duration-300 ease-in-out"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <DropdownMenuItem
            className="text-xs flex items-center justify-between cursor-default hover:bg-gray-200 px-2"
            onClick={() => setSortCriterion("dateAsc")}
          >
            Date
            <IconSortAscending size={"16"} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex text-xs items-center justify-between cursor-default hover:bg-gray-200 px-2"
            onClick={() => setSortCriterion("dateDesc")}
          >
            Date <IconSortDescending size={"16"} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex text-xs items-center justify-between cursor-default hover:bg-gray-200 px-2"
            onClick={() => setSortCriterion("priorityAsc")}
          >
            Priority
            <IconSortAscending size={"16"} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex text-xs items-center justify-between cursor-default hover:bg-gray-200 px-2"
            onClick={() => setSortCriterion("priorityDesc")}
          >
            Priority
            <IconSortDescending size={"16"} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
