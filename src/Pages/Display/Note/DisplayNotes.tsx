import {
  IconPaletteFilled,
  IconPencil,
  IconPinFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Note } from "@/Interface/Types";
import { deleteNoteFunction, pinNoteFunction } from "./NoteFunctions";
import { FloatingContainer } from "@/Pages/Home/MainApp/CreateNew/Floating";

interface DisplayNote {
  note: Note;
  content: string;
  image?: string | null;
}

export const DisplayNotes = ({ note, content, image }: DisplayNote) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const selectedItem = "newNote";
  const bottomToolbar = useRef<HTMLDivElement | null>(null);
  const editButton = useRef<HTMLButtonElement | null>(null);

  const handleEdit = (e: React.MouseEvent) => {
    if (bottomToolbar.current?.contains(e.target as Node)) {
      if (editButton.current?.contains(e.target as Node)) {
        setIsEditing(true);
        return;
      }
      return;
    }
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteNoteFunction(note.id, dispatch);
  };

  const handlePin = () => {
    console.log("Pin clicked");
    console.log(note);
    pinNoteFunction(note.id, dispatch, !note.Pinned);
  };

  return (
    <>
      <div
        className="display-note mb-2 p-2 bg-secondary text-[var(--primary-1)] max-w-[400px] relative pb-6 !important break-inside-avoid flex flex-col hover:scale-101 hover:shadow-lg justify-start items-start w-[300px] h-auto rounded-lg shadow-md duration-300 ease-in-out transition-shadow will-change-transform cursor-pointer"
        onClick={handleEdit}
      >
        <div className="image-note-display">
          {image && <img className="w-full h-full" src={image}></img>}
        </div>

        <h1 className="note-display-title text-center !text-lg font-bold">
          {note?.Title}
        </h1>
        <p
          className="note-display-text text-xs text-left break-words mb-4 max-w-[400px]"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content),
          }}
        ></p>
        <div
          className="bottom-toolbar text-primary opacity-0 absolute w-full mb-2 h-8 bottom-0 left-0 rounded-b-lg flex fill-primary items-center justify-between p-2 gap-2 transition-opacity duration-300 ease-in-out"
          ref={bottomToolbar}
        >
          <button className="manipulate-button color-note-button hover:shadow-[inset_1px_1px_10px_rgba(0,0,0,0.3)] !rounded-full !p-2 ">
            <IconPaletteFilled size={14} className="all-unset" />
          </button>
          <button
            className="manipulate-button pin-note-button hover:shadow-[inset_1px_1px_10px_rgba(0,0,0,0.3)] !rounded-full !p-2"
            onClick={handlePin}
          >
            <IconPinFilled size={14} className="all-unset" />
          </button>
          <button
            ref={editButton}
            className="manipulate-button edit-note-button hover:shadow-[inset_1px_1px_10px_rgba(0,0,0,0.3)] !rounded-full !p-2"
            onClick={handleEdit}
          >
            <IconPencil size={14} className="all-unset" />
          </button>
          <button
            className="manipulate-button delete-note-button hover:shadow-[inset_1px_1px_10px_rgba(0,0,0,0.3)] !rounded-full !p-2"
            onClick={handleDelete}
          >
            <IconTrashFilled size={14} className="all-unset" />
          </button>
        </div>
      </div>
      {isEditing && note && (
        <div className="for-floating">
          <FloatingContainer
            clicked={isEditing}
            setClicked={setIsEditing}
            selectedItem={selectedItem}
            note={note}
            content={content}
          />
        </div>
      )}
    </>
  );
};
