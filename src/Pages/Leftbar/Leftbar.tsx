"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconHome, IconListCheck, IconNotes } from "@tabler/icons-react";
import { handleNavigation } from "../Functions/Functions";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";

interface LeftBarProps {
  setCurrentPage: (value: string) => void;
}

type CategoryType = {
  id: string;
  name: string;
  count: number;
};

export const LeftBar = ({ setCurrentPage }: LeftBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const callHandleNavigation = (page: string) => {
    handleNavigation({ page, setCurrentPage });
  };

  const [categories] = useState<CategoryType[]>([
    { id: "all", name: "All Tasks", count: 18 },
    { id: "today", name: "Today", count: 5 },
    { id: "upcoming", name: "Upcoming", count: 8 },
    { id: "completed", name: "Completed", count: 12 },
  ]);

  useEffect(() => {
    setIsCollapsed(true);
  }, []);

  // const [tags] = useState([
  //   { id: "work", name: "Work", color: "bg-blue-500" },
  //   { id: "personal", name: "Personal", color: "bg-purple-500" },
  //   { id: "urgent", name: "Urgent", color: "bg-red-500" },
  //   { id: "ideas", name: "Ideas", color: "bg-green-500" },
  // ]);

  return (
    <>
      <div
        className={cn(
          "h-screen bg-sidebar border-r border-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[90px]" : "w-[300px]"
        )}
      >
        <div
          className={cn(
            "flex items-center p-3.5 border-b border-border",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && <h2 className="font-semibold text-lg">ZenTask</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(isCollapsed ? "" : "ml-auto")}
          >
            <MenuIcon className={cn("h-5 w-5 transition-all")} />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <div className="space-y-6">
            <div>
              <Button
                className={cn(
                  "nav-button w-full flex items-center justify-center border-1 cursor-pointer hover:bg-blue-300 hover:text-white text-[var(--text-color)] hover:scale-105 transition-all ease-in-out delay-50 border-blue-300",
                  isCollapsed ? "border-l-1" : "border-l-5"
                )}
                onClick={() => callHandleNavigation("Main")}
                variant={"ghost"}
              >
                <div
                  className={cn(
                    "group-link flex items-center justify-center transition-all duration-300",
                    !isCollapsed && "gap-[0.5rem]"
                  )}
                >
                  <IconHome className="text-[#1c1d16] transition-colors" />
                  <p
                    className={cn(
                      "transition-all duration-300 overflow-hidden whitespace-nowrap",
                      isCollapsed
                        ? "opacity-0 max-w-0"
                        : "opacity-100 max-w-[200px]"
                    )}
                  >
                    Home
                  </p>
                </div>
              </Button>
            </div>
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="w-full ">
                  <AccordionTrigger className="w-full !p-0">
                    <Button
                      className={cn(
                        "nav-button w-full flex items-center justify-center border-red-300 border-1 cursor-pointer hover:bg-red-300 hover:text-white text-[var(--text-color)] hover:scale-105 transition-all ease-in-out delay-50",
                        isCollapsed ? "border-l-1" : "border-l-5"
                      )}
                      onClick={() => callHandleNavigation("Task")}
                      variant={"ghost"}
                    >
                      <div
                        className={cn(
                          "group-link items-center justify-center flex",
                          !isCollapsed && "gap-[0.5rem]"
                        )}
                      >
                        <IconListCheck className="text-[#1c1d16] transition-colors" />
                        <p
                          className={cn(
                            "transition-all duration-300 overflow-hidden whitespace-nowrap",
                            isCollapsed
                              ? "opacity-0 max-w-0"
                              : "opacity-100 max-w-[200px]" // adjust max-w as needed
                          )}
                        >
                          Tasks
                        </p>
                      </div>
                    </Button>
                  </AccordionTrigger>
                  <AccordionContent>
                    {!isCollapsed && (
                      <ul className="mt-[0.5rem] gap-[0.5rem] flex flex-col">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Button
                              className={cn(
                                "w-full flex items-center bg-transparent text-[var(--secondary-text-color)] hover:bg-black/20"
                              )}
                              variant={"default"}
                            >
                              {category.name}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div>
              <Button
                className={cn(
                  "nav-button w-full flex items-center justify-center border-1 cursor-pointer hover:bg-green-700 hover:text-white text-[var(--text-color)] hover:scale-105 transition-all ease-in-out delay-50 border-green-700",
                  isCollapsed ? "border-l-1" : "border-l-5"
                )}
                onClick={() => callHandleNavigation("Note")}
                variant={"ghost"}
              >
                <div
                  className={cn(
                    "group-link items-center justify-center flex",
                    !isCollapsed && "gap-[0.5rem]"
                  )}
                >
                  <IconNotes className="text-[#1c1d16] transition-colors" />
                  <p
                    className={cn(
                      "transition-all duration-300 overflow-hidden whitespace-nowrap",
                      isCollapsed
                        ? "opacity-0 max-w-0"
                        : "opacity-100 max-w-[200px]" // adjust max-w as needed
                    )}
                  >
                    Notes
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
