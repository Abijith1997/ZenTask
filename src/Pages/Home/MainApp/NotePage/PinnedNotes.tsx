import { pinnedNotesProps } from "@/Interface/Types";
import { DisplayNotes } from "@/Pages/Display/Note/DisplayNotes";
import { IconPinFilled } from "@tabler/icons-react";

export const PinnedNotes = ({ pinnedNotes }: pinnedNotesProps) => {
  return (
    <div className="items-start justify-start flex w-full flex-col gap-4 note-whole-list sm:p-4 h-auto">
      <div className="pinned-heading text-xl flex gap-1 items-center">
        <h2 className="font-bold">Pinned</h2>
        <IconPinFilled size={18} />
      </div>
      <div className="all-notes w-full [column-width:120px] [column-gap:25px] sm:[column-gap:50px] sm:[column-width:250px]">
        {pinnedNotes.length > 0 ? (
          pinnedNotes.map((note, index) => (
            <DisplayNotes
              key={note.id ?? `note-${index}`}
              note={note}
              content={note.Content}
              image={note.Image}
            />
          ))
        ) : (
          <li>No notes found</li>
        )}
      </div>
    </div>
  );
};
