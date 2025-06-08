import { handleNewProps } from "@/Interface/Types";

export const handleNew = ({
  setClicked,
  event,
  setSelectedItem,
}: handleNewProps) => {
  setClicked(true);
  const targetClassList = event.currentTarget.classList; // Get the clicked button's class

  if (targetClassList.contains("new-note-button")) {
    setSelectedItem("newNote");
  } else if (targetClassList.contains("new-task-button")) {
    setSelectedItem("newTask");
  }
};
