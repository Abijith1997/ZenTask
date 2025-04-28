import { Note } from "@/Interface/Types";
import { DisplayNotes } from "@/Pages/Display/Note/DisplayNotes";
import { IconPinFilled } from "@tabler/icons-react";

interface pinnedNotesProps {
  pinnedNotes: Note[];
}

export const PinnedNotes = ({ pinnedNotes }: pinnedNotesProps) => {
  return (
    <div className="items-start justify-start flex w-full flex-col gap-4 note-whole-list p-4 h-auto">
      <div className="pinned-heading text-xl flex gap-1 items-center">
        <h2 className="font-bold">Pinned</h2>
        <IconPinFilled size={18} />
      </div>
      <div className="all-notes w-full [column-width:300px] [column-gap:16px]">
        {pinnedNotes.length > 0 ? (
          pinnedNotes.map((note) => (
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
