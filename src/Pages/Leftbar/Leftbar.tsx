"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconCaretDown, IconHome, IconNotes } from "@tabler/icons-react";
import { handleNavigation } from "../Functions/Functions";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { CategoryType, LeftBarProps } from "@/Interface/Types";

export const LeftBar = ({
  setCurrentPage,
  isFilterActive,
  setFilterCategory,
  filterActive,
  filterCategory,
  currentPage,
}: LeftBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [options, setOptions] = useState(false);
  const callHandleNavigation = (page: string) => {
    handleNavigation({ page, setCurrentPage });
  };

  const [categories] = useState<CategoryType[]>([
    {
      id: "all",
      name: "All Tasks",
      background: "bg-background hover:text-white",
    },
    {
      id: "personal",
      name: "Personal",
      background: "bg-red-400 hover:bg-red-600 hover:text-white",
    },
    {
      id: "work",
      name: "Work",
      background: "bg-blue-400 hover:bg-blue-600  hover:text-white",
    },
    {
      id: "idea",
      name: "Ideas",
      background: "bg-yellow-400 hover:bg-yellow-600 hover:text-white",
    },
  ]);

  useEffect(() => {
    setIsCollapsed(true);
  }, []);

  const expandTasks = () => {
    const create = document.querySelector(".create-new-container");
    const gemini = document.querySelector(".whole-gemini");
    const addClass = () => {
      create?.classList.toggle("sm:hidden");
      gemini?.classList.toggle("hidden");
    };
    if (currentPage !== "Main" && isCollapsed) {
      setCurrentPage("Main");
      return;
    }

    isCollapsed ? addClass() : setOptions(!options);
  };

  const filterTasksbyCategory = (category: string) => {
    if (category === "all") {
      isFilterActive(false);
      setFilterCategory("all");
      setCurrentPage("Main");
      return;
    }
    if (category === filterCategory && filterActive) {
      isFilterActive(!filterActive);
      setFilterCategory("all");
      return;
    } else if (filterActive && category !== filterCategory) {
      setFilterCategory(category);
    } else {
      isFilterActive(!filterActive);
      setFilterCategory(category);
    }
  };

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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="w-full ">
                  <AccordionTrigger className="w-full !p-0">
                    <Button
                      asChild
                      className={cn(
                        "nav-button w-full flex items-center relative justify-center border-red-300 border-1 cursor-pointer hover:bg-red-300 hover:text-white text-[var(--text-color)] hover:scale-105 transition-all ease-in-out delay-50",
                        isCollapsed ? "border-l-1" : "border-l-5"
                      )}
                      onClick={() => expandTasks()}
                      variant={"ghost"}
                    >
                      <div
                        className={cn(
                          "group-link items-center justify-center flex",
                          isCollapsed ? "gap-0" : "gap-[0.5rem]"
                        )}
                      >
                        <IconHome
                          className={cn(
                            "text-[#1c1d16] transition-colors",
                            isCollapsed && "absolute"
                          )}
                        />
                        <p
                          className={cn(
                            "transition-all duration-300 overflow-hidden whitespace-nowrap",
                            isCollapsed
                              ? "opacity-0 max-w-0 scale-x-0"
                              : "opacity-100 max-w-[200px]"
                          )}
                        >
                          Home
                        </p>
                        <div
                          className={cn(
                            "transition-all duration-300 overflow-hidden whitespace-nowrap",
                            isCollapsed
                              ? "opacity-0 max-w-0 scale-x-0"
                              : "opacity-100 max-w-[200px]"
                          )}
                        >
                          <IconCaretDown />
                        </div>
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
                                "w-full bg-background text-black",
                                category.background
                              )}
                              variant={"outline"}
                              onClick={() => filterTasksbyCategory(category.id)}
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
                        : "opacity-100 max-w-[200px]"
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
