import { useEffect, useRef, useState } from "react";
import {
  IconCircleX,
  IconPalette,
  IconPhoto,
  IconPin,
} from "@tabler/icons-react";
import { User } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { Note } from "@/Interface/Types";
import { AppDispatch } from "@/Store";
import { supabase } from "@/supabaseClient";
import { insertNoteInDB, updateNoteInDB } from "@/Slices/NoteSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AddNoteProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  note?: Note;
  content?: string;
  color: string;
  setColor: (color: string) => void;
}

export const AddNote = ({
  clicked,
  setClicked,
  note,
  content,
  color,
  setColor,
}: AddNoteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [fontColor, setFontColor] = useState("text-primary");
  const [title, setTitle] = useState<string>(note?.Title ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const [changingColor, setChangingColor] = useState(false);
  const [description, setDescription] = useState<string>(content ?? "");
  const [isPinned, setIsPinned] = useState(false);
  const [image, setImage] = useState<File | string | null>(note?.Image || null);
  const bottomToolbar = useRef<HTMLDivElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("image upload clicked");
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;
      setUser(data?.user);
      return data.user;
    };
    getUser();
  }, [user]);

  const handleSave = async () => {
    console.log("In handle save");
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (!title && !description && !image) {
      console.warn("Note is empty. Skipping save.");
      return;
    }

    try {
      const isEmptyNote = Object.keys(note ?? {}).length === 0;

      console.log(note);
      console.log(isEmptyNote ? "Saving new note..." : "Updating note...");
      let imageURL = "";

      if (image && image instanceof File) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, image);

        if (error) {
          console.error("Error uploading image:", error.message);
        } else {
          console.log(data);
          const { data: url } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);
          imageURL = url.publicUrl;
        }
      }

      if (!isEmptyNote) {
        // ✏️ Update existing note
        const noteUpdate = {
          id: note!.id,
          updates: {
            Content: description,
            Title: title,
            Pinned: isPinned,
            updatedAt: new Date().toISOString(),
            Image: imageURL || note?.Image || "",
          },
        };
        const result = await dispatch(updateNoteInDB(noteUpdate)).unwrap();
        console.log("Note updated:", result);
      } else {
        // 🆕 Insert new note
        const newNote: Note = {
          id: crypto.randomUUID(),
          Content: description,
          created_at: new Date().toISOString(),
          uuid: user.id,
          Title: title,
          Pinned: isPinned,
          updatedAt: new Date().toISOString(),
          Image: imageURL,
          color: color,
        };
        const result = await dispatch(insertNoteInDB(newNote)).unwrap();
        console.log("Note inserted:", result);
      }

      setTitle("");
      setDescription("");
      setImage(null);
      setIsPinned(false);
      setClicked(false);
      setFontColor("text-secondary");
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleColor = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (bottomToolbar) {
      setChangingColor(!changingColor);
    }
  };

  const changeColor = (
    e: React.MouseEvent<HTMLButtonElement>,
    color: string
  ) => {
    e.stopPropagation();
    setChangingColor(false);
    switch (color) {
      case "red":
        setColor("bg-red-300");
        setFontColor("text-black");
        break;
      case "blue":
        setColor("bg-blue-500");
        setFontColor("text-slate-800");
        break;
      case "green":
        setColor("bg-lime-300");
        break;
      case "yellow":
        setColor("bg-yellow-300");
        break;
      default:
        break;
    }
  };

  const handleColorBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setChangingColor(false);
  };

  return (
    clicked && (
      <div
        className={cn(
          "w-full h-full flex flex-col justify-between p-5 mt-10",
          fontColor
        )}
      >
        <div className="w-full flex justify-center items-center">
          <h2 className="text-md  font-bold underline mb-5">New Note</h2>
        </div>

        {typeof image === "string" && (
          <img
            src={image}
            alt="Existing"
            className="uploaded-image w-full max-w-[500px] max-h-[300px] object-cover rounded-md"
          />
        )}

        {image instanceof File && (
          <div className="image-container">
            <img
              src={URL.createObjectURL(image)}
              className="uploaded-image uploaded-image w-full max-w-[500px] max-h-[300px] object-cover rounded-md"
              alt="Uploaded"
            />
          </div>
        )}
        <div className="note-group flex flex-col justify-between h-full w-full">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="test-title border-0 border-b-1 !rounded-none border-primary"
            placeholder="Title"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="test-description resize-none mt-5 border border-primary"
            placeholder="Write Note"
          />
        </div>
        {!changingColor ? (
          <div
            className="bottom-bar flex justify-between items-center w-full p-5"
            ref={bottomToolbar}
          >
            <div
              className="color-picker bottom-button cursor-pointer hover:bg-accent p-2 rounded-full"
              onClick={handleColor}
            >
              <IconPalette color="var(--primary)" />
            </div>

            <span
              onClick={() => setIsPinned((prev) => !prev)}
              className="pin-button bottom-button cursor-pointer hover:bg-accent p-2 rounded-full"
            >
              <IconPin color="var(--primary)" />
            </span>

            <div
              style={{ cursor: "pointer" }}
              className="image-upload bottom-button cursor-pointer hover:bg-accent p-2 rounded-full transition "
            >
              <IconPhoto size={20} color="var(--primary)" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>
        ) : (
          <div className="color-toolbar text-primary opacity-100 mt-5 w-full mb-2 h-8 bottom-0 left-0 rounded-b-lg flex fill-primary items-center justify-between p-2 gap-2 transition-opacity duration-300 ease-in-out">
            <button
              className="bg-secondary-300 !rounded-full !p-1 ml-1 cursor-pointer hover:scale-105"
              onClick={(e) => handleColorBack(e)}
            >
              <IconCircleX />
            </button>
            <button
              className="bg-green-300 !rounded-full !p-2 border border-secondary hover:scale-105"
              onClick={(e) => changeColor(e, "green")}
            ></button>
            <button
              className="bg-red-300 !rounded-full !p-2 border border-secondary hover:scale-105"
              onClick={(e) => changeColor(e, "red")}
            ></button>
            <button
              className="bg-blue-300 !rounded-full !p-2 border border-secondary hover:scale-105"
              onClick={(e) => changeColor(e, "blue")}
            ></button>
            <button
              className="bg-yellow-300 !rounded-full !p-2 mr-1 border border-secondary hover:scale-105"
              onClick={(e) => changeColor(e, "yellow")}
            ></button>
          </div>
        )}
        <div className="button-container justify-end flex w-full">
          <button
            className="save-button bg-primary w-20 text-secondary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    )
  );
};
