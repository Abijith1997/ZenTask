interface handleNavigationProps {
  page: string;
  setCurrentPage: (value: string) => void;
}

export const handleNavigation = ({
  page,
  setCurrentPage,
}: handleNavigationProps) => {
  setCurrentPage(page);
};
