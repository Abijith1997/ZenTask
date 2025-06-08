import { handleNavigationProps } from "@/Interface/Types";

export const handleNavigation = ({
  page,
  setCurrentPage,
}: handleNavigationProps) => {
  setCurrentPage(page);
};
