import { Button } from "@/components/ui/button";
import { IconBrightness2 } from "@tabler/icons-react";

export const ThemeToggle = () => {
  const svgColor = "#e9ecef";
  return (
    <Button
      variant="outline"
      className="theme-button h-[2.2rem] w-[2.2rem] p-0 m-0 !rounded-full"
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
