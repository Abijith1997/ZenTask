interface Props {
  setClicked: (clicked: boolean) => void;
  setSelectedItem: (item: string) => void;
  event: React.MouseEvent<HTMLButtonElement>;
}

export const handleNew = ({ setClicked, event, setSelectedItem }: Props) => {
  setClicked(true);
  const targetClassList = event.currentTarget.classList; // Get the clicked button's class

  if (targetClassList.contains("new-note-button")) {
    setSelectedItem("newNote");
  } else if (targetClassList.contains("new-task-button")) {
    setSelectedItem("newTask");
  }
};
