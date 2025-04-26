import { InstantNote } from "@/Pages/Display/Note/InstantNote";
import { NoteList } from "@/Pages/Display/Note/NoteList";
import { setNotes } from "@/Slices/NoteSlice";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PinnedNotes } from "./PinnedNotes";
import { Note } from "@/Interface/Types";
import { RootState } from "@/Store";

interface NotePageProps {
  user: User;
}

export const NotePage = ({ user }: NotePageProps) => {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
  const noteList = useSelector((state: RootState) => state.note.notes);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotes = async () => {
      console.log("fetching notes");
      const { data, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      dispatch(setNotes(data));
    };

    fetchNotes();
  }, [user]);

  useEffect(() => {
    const filteredNotes = noteList.filter((note) => !note.Pinned);
    setLocalNotes(filteredNotes);
  }, [noteList]);

  useEffect(() => {
    const filteredNotes = noteList.filter((note) => note.Pinned);
    setPinnedNotes(filteredNotes);
  }, [localNotes]);

  return (
    <div className="note-page flex flex-col items-start justify-start box-border mt-16 min-h-[100dvh] top-0 sm:right-0 sm:ml-24 sm:w-[calc(100%_-_6rem)] overflow-y-auto p-10 w-full">
      <InstantNote />
      <PinnedNotes pinnedNotes={pinnedNotes} />
      <NoteList localNotes={localNotes} />
    </div>
  );
};
