export interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
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
}
