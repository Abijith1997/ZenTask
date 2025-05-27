import { Button } from "@/components/ui/button";
import { IconBrightness2 } from "@tabler/icons-react";

export const ThemeToggle = () => {
  const svgColor = "#e9ecef";

  const toggleDarkMode = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  return (
    <Button
      variant="outline"
      className="theme-button h-[2.2rem] w-[2.2rem] p-0 m-0 !rounded-full bg-primary"
      onClick={toggleDarkMode} // 👉 add onClick here
    >
      <IconBrightness2
        className="icon"
        size={"1.5rem"}
        stroke={1.5}
        color={svgColor}
      />
    </Button>
  );
};
