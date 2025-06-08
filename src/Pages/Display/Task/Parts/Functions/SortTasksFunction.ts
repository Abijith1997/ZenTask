import { Task } from "@/Interface/Types";

interface sortTasksProps {
  sortCriterion: string;
  setTasksToDisplay: (tasks: Task[]) => void;
  tasks: Task[];
}

export const sortTasks = ({
  sortCriterion,
  setTasksToDisplay,
  tasks,
}: sortTasksProps) => {
  const priorityValue: Record<string, number> = {
    High: 1,
    Medium: 2,
    Low: 3,
    None: 99,
  };

  let sortedTasks = tasks;
  switch (sortCriterion) {
    case "dateAsc":
      sortedTasks.sort((a, b) => {
        const dateDiff =
          new Date(a.Due || 0).getTime() - new Date(b.Due || 0).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (
          (priorityValue[a.Priority] ?? 99) - (priorityValue[b.Priority] ?? 99)
        );
      });
      break;

    case "dateDesc":
      sortedTasks.sort((a, b) => {
        const dateDiff =
          new Date(b.Due || 0).getTime() - new Date(a.Due || 0).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (
          (priorityValue[a.Priority] ?? 99) - (priorityValue[b.Priority] ?? 99)
        );
      });
      break;

    case "priorityAsc":
      sortedTasks.sort((a, b) => {
        const priorityDiff =
          (priorityValue[a.Priority] ?? 99) - (priorityValue[b.Priority] ?? 99);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.Due || 0).getTime() - new Date(b.Due || 0).getTime();
      });
      break;

    case "priorityDesc":
      sortedTasks.sort((a, b) => {
        const priorityDiff =
          (priorityValue[b.Priority] ?? 99) - (priorityValue[a.Priority] ?? 99);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.Due || 0).getTime() - new Date(b.Due || 0).getTime();
      });
      break;

    default:
  }

  setTasksToDisplay(sortedTasks);
};
