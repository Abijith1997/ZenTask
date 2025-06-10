import { InstantNote } from "@/Pages/Display/Note/InstantNote";
import { NoteList } from "@/Pages/Display/Note/NoteList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PinnedNotes } from "./PinnedNotes";
import { Note } from "@/Interface/Types";
import { RootState } from "@/Store";

export const NotePage = () => {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
  const noteList = useSelector((state: RootState) => state.note.notes);

  useEffect(() => {
    const filteredNotes = noteList.filter((note) => !note.Pinned);
    setLocalNotes(filteredNotes);
  }, [noteList]);

  useEffect(() => {
    const filteredNotes = noteList.filter((note) => note.Pinned);
    setPinnedNotes(filteredNotes);
  }, [localNotes]);

  return (
    <div className="note-page flex flex-col items-start justify-start box-border min-h-[100dvh] top-0 sm:right-0 sm:ml-24 sm:w-[calc(100%_-_6rem)] overflow-y-auto p-10 w-full">
      <InstantNote />
      <PinnedNotes pinnedNotes={pinnedNotes} />
      <NoteList localNotes={localNotes} />
    </div>
  );
};
