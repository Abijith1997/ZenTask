import { Note } from "@/Interface/Types";
import { RootState } from "@/Store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DisplayNotes } from "./DisplayNotes";

export const NoteList = () => {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const noteList = useSelector((state: RootState) => state.note.notes);

  useEffect(() => {
    console.log("noteList has changed");
    setLocalNotes(noteList);
  }, [noteList]);

  return (
    <div className="note-whole-list flex flex-col items-center p-4 justify-start w-full h-full flex-[0_0_50%]">
      <h1 className="!text-2xl font-bold" style={{ marginBottom: "1rem" }}>
        Notes
      </h1>
      <div className="all-notes w-full [column-width:300px] [column-gap:16px]">
        {localNotes.length > 0 ? (
          localNotes.map((note) => (
            <>
              <DisplayNotes
                key={note.id}
                note={note}
                content={note.Content}
                image={note.Image}
              />
            </>
          ))
        ) : (
          <li>No notes found</li>
        )}
      </div>
    </div>
  );
};
