import { User } from "@supabase/supabase-js";

export interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
  Gemini_ID: string | null;
  Tags: {};
  Priority: string;
}

export type CategoryType = {
  id: string;
  name: string;
  background: string;
};

export interface SignUpFormValues {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

export interface ProfilePageProps {
  user: User;
}

export interface NavbarProps {
  user: User | null;
  setCurrentPage: (value: string) => void;
}

export interface DisplayNote {
  note: Note;
  content: string;
  image?: string | null;
}

export interface NoteListProps {
  localNotes: Note[];
}

export interface handleGeminiSaveProps {
  response: string;
  dispatch: any;
  task: Task;
}

export interface getAndSetTasksProps {
  user: User;
  setCompletedTasks: (value: Task[]) => void;
  setIncompleteTasks: (value: Task[]) => void;
}

export interface TagProps {
  tags: string[];
  setTags: (value: string[]) => void;
}

export interface CreateNewMobileProps {
  setSelectedItem: (item: string | null) => void;
  setClicked: (clicked: boolean) => void;
  clicked: boolean;
  selectedItem: string | null;
  note?: Note;
}

export interface MainAppProps {
  user: User;
  filterActive: boolean;
  filterCategory: string;
}

export interface LeftBarProps {
  setCurrentPage: (value: string) => void;
  isFilterActive: (value: boolean) => void;
  setFilterCategory: (value: string) => void;
  filterActive: boolean;
  filterCategory: string;
  currentPage: string;
}

export interface pinnedNotesProps {
  pinnedNotes: Note[];
}

export interface GeminiProps {
  homeTasks: Task[];
}

export interface HomeViewProps {
  user: User;
  clicked: boolean;
  setClicked: (value: boolean) => void;
  setSelectedItem: (value: string | null) => void;
  setSelectedTask: (value: Task | undefined) => void;
  filterCategory: string;
  filterActive: boolean;
}

export interface FloatingContainerProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  selectedItem: string | null;
  note?: Note;
  selectedTask?: Task;
  setSelectedTask?: (task: Task | undefined) => void;
}

export interface CreateNewProps {
  setSelectedItem: (item: string | null) => void;
  setClicked: (clicked: boolean) => void;
  clicked: boolean;
  selectedItem: string | null;
}

export interface AddTaskProps {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
  dateRef?: React.RefObject<HTMLDivElement | null>;
  selectingDate: boolean;
  setSelectingDate: (value: boolean) => void;
  ddmRef?: React.RefObject<HTMLDivElement | null>;
  task?: Task;
}

export interface handleNewProps {
  setClicked: (clicked: boolean) => void;
  setSelectedItem: (item: string) => void;
  event: React.MouseEvent<HTMLButtonElement>;
}

export interface DateTimeProps {
  setSelectedTime: (value: string) => void;
  selectedTime?: string | null;
  dateRef?: React.RefObject<HTMLDivElement | null>;
}

export interface PrioritySelectorProps {
  Priority: string;
  setPriority: (priority: string) => void;
  priorityBg: string;
}

export interface AddNoteProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  note?: Note;
  setColor: (color: string) => void;
}

export interface handleNavigationProps {
  page: string;
  setCurrentPage: (value: string) => void;
}

export interface handleSaveProps {
  selectedTime: string;
  dispatch: any;
  task: any;
  editTitle: string;
  editDescription: string;
  setIsEditing: (value: boolean) => void;
  tags?: string[];
  Priority: string;
}

export interface TaskListProps {
  user: User;
  clicked: boolean;
  setClicked: (value: boolean) => void;
  setSelectedItem: (value: string | null) => void;
  setSelectedTask: (value: Task | undefined) => void;
  filterCategory: string;
  filterActive: boolean;
}

export interface GeminiHTMLViewerProps {
  url: string | null;
}

export interface SortTasksProps {
  setSortCriterion: (criterion: string) => void;
  sortCriterion: string;
}

export interface invokeGeminiProps {
  setGenerateNew: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  e: React.MouseEvent<HTMLDivElement>;
  task: Task;
  setResponse: (value: string) => void;
  response: string;
}

export interface Note {
  id: `${string}-${string}-${string}-${string}-${string}`;
  Content: string;
  created_at: string;
  uuid: string;
  Title: string;
  Pinned: boolean;
  updatedAt: string;
  Image: string | null;
  color: string | null;
}

export interface DisplayTasksProps {
  setSelectedItem: (value: string | null) => void;
  task: Task;
  checked: boolean;
  setChecked: (value: boolean) => void;
  clicked: boolean;
  setClicked: (value: boolean) => void;
  setSelectedTask: (value: Task | undefined) => void;
}

export interface dueColorProps {
  minutesUntilDue: number;
  checked: boolean;
}

export interface handleCheckProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
  task: Task;
  dispatch: any;
  tasks: Task[];
}
