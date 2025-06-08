import { TagProps } from "@/Interface/Types";
import { cn } from "@/lib/utils";

export const TagSelector = ({ tags, setTags }: TagProps) => {
  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let selectedTag = e.currentTarget.id;
    if (tags.includes(selectedTag)) {
      setTags(tags.filter((t) => t !== selectedTag));
      return;
    }
    setTags([...tags, selectedTag]);
    return;
  };

  return (
    <div className="flex gap-2">
      <div>
        <button
          id="work"
          className={cn(
            "h-8 w-fit-content flex items-center text-xs hover:bg-blue-400",
            tags.includes("work") ? "bg-blue-400" : "bg-blue-200"
          )}
          onClick={(e) => addTag(e)}
        >
          Work
        </button>
      </div>
      <div>
        <button
          id="personal"
          className={cn(
            "h-8 w-fit-content flex items-center text-xs hover:bg-blue-400",
            tags.includes("personal") ? "bg-red-400" : "bg-red-200"
          )}
          onClick={(e) => addTag(e)}
        >
          Personal
        </button>
      </div>
      <div>
        <button
          id="idea"
          className={cn(
            "h-8 w-fit-content flex items-center text-xs hover:bg-yellow-500",
            tags.includes("idea") ? "bg-yellow-500" : "bg-yellow-200"
          )}
          onClick={(e) => addTag(e)}
        >
          Idea
        </button>
      </div>
    </div>
  );
};
