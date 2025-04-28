export interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
  Gemini_ID: string | null;
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
  task: Task;
  checked: boolean;
  setChecked: (value: boolean) => void;
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
