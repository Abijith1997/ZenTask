import { Note } from "@/Interface/Types";
import { DisplayNotes } from "./DisplayNotes";

interface NoteListProps {
  localNotes: Note[];
}

export const NoteList = ({ localNotes }: NoteListProps) => {
  return (
    <div className="note-whole-list flex flex-col items-center p-4 justify-start w-full h-full flex-[0_0_50%]">
      <div className="flex w-full text-2xl">
        <h3 className=" font-bold align-start justify-start mb-4">Notes</h3>
      </div>

      <div className="all-notes w-full [column-width:10rem] [column-gap:1.5rem] sm:[column-width:300px] sm:[column-gap:16px]">
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
