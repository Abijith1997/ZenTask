import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { IconHome, IconListCheck, IconNotes } from "@tabler/icons-react";
import { handleNavigation } from "../Functions/Functions";

interface LeftBarProps {
  setCurrentPage: (value: string) => void;
}

export const LeftBar = ({ setCurrentPage }: LeftBarProps) => {
  const svgColor = "#424242";

  const callHandleNavigation = (page: string) => {
    handleNavigation({ page, setCurrentPage });
  };

  return (
    <>
      <div className="sm:block hidden leftbar sm:z-[100] fixed top-0 left-0 w-[4rem]  sm:w-[6rem] sm:min-h-screen py-4 bg-background">
        <div className="top-gap flex items-start justify-center h-[3rem]  pt-1.5"></div>
        <div className="hidden navlinks sm:flex items-center justify-center flex-col gap-[1rem] p-[1rem] border-t-[2px] border-t-[#f3f3f6]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a className="w-[100%]">
                  <Button
                    className="nav-button w-full flex items-center justify-center"
                    onClick={() => callHandleNavigation("Main")}
                  >
                    <div className="group-link items-center justify-center gap-[0.5rem]">
                      <IconHome color={svgColor} />
                    </div>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs p-[0.5rem] bg-secondary text-[var(--text-color)] rounded-sm">
                  Home
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a className="w-[100%]">
                  <Button
                    className="nav-button w-full justify-center flex items-center"
                    onClick={() => callHandleNavigation("Task")}
                  >
                    <div className="group-link items-center justify-center gap-[0.5rem]">
                      <IconListCheck color={svgColor} />
                    </div>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs p-[0.5rem] bg-secondary text-[var(--text-color)] rounded-sm">
                  Tasks
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a className="w-[100%]">
                  <Button
                    className="nav-button w-full flex items-center justify-center"
                    onClick={() => callHandleNavigation("Note")}
                  >
                    <div className="group-link items-center justify-center gap-[0.5rem]">
                      <IconNotes color={svgColor} />
                    </div>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs p-[0.5rem] bg-secondary text-[var(--text-color)] rounded-sm">
                  Notes
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};
