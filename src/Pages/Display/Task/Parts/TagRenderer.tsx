import { JSX, useEffect, useState } from "react";

interface Props {
  tags: {};
}

export const TagRenderer = ({ tags }: Props) => {
  const BlueCircle = () => (
    <div className="bg-blue-500 rounded-md px-2 py-0.5 text-xs text-white">
      Work
    </div>
  );
  const YellowCircle = () => (
    <div className="bg-yellow-500 rounded-md px-2 py-0.5 text-xs text-white">
      Idea
    </div>
  );
  const RedCircle = () => (
    <div className="bg-red-500 rounded-md px-2 py-0.5 text-xs text-white">
      Personal
    </div>
  );

  const [circles, setCircles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateCircles = () => {
      if (!tags || Object.keys(tags).length === 0) return [];

      return Object.entries(tags)
        .filter(([_, value]) => value)
        .map(([_, value], idx) => {
          if (typeof value === "string") {
            switch (value.toLowerCase()) {
              case "personal":
                return <RedCircle key={idx} />;
              case "work":
                return <BlueCircle key={idx} />;
              case "idea":
                return <YellowCircle key={idx} />;
              default:
                return null;
            }
          }
          return null;
        })
        .filter(Boolean) as JSX.Element[];
    };

    setCircles(generateCircles());
  }, [tags]);

  return <div className="flex gap-2">{circles}</div>;
};
