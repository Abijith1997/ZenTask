import { useEffect, useRef, useState } from "react";
import {
  IconCircleX,
  IconPalette,
  IconPhoto,
  IconPin,
} from "@tabler/icons-react";
import { User } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { AddNoteProps, Note } from "@/Interface/Types";
import { AppDispatch } from "@/Store";
import { supabase } from "@/supabaseClient";
import { insertNoteInDB, updateNoteInDB } from "@/Slices/NoteSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const AddNote = ({
  clicked,
  setClicked,
  note,
  setColor,
}: AddNoteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fontColor, setFontColor] = useState("!text-black");
  const [title, setTitle] = useState<string>(note?.Title ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const [changingColor, setChangingColor] = useState(false);
  const [description, setDescription] = useState<string>(note?.Content ?? "");
  const [isPinned, setIsPinned] = useState(false);
  const [image, setImage] = useState<File | string | null>(note?.Image || null);
  const bottomToolbar = useRef<HTMLDivElement | null>(null);
  const [placeholderColor, setplaceholderColor] = useState("text-secondary");
  const [dbColor, setDBColor] = useState<string>(note?.color || "");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("image upload clicked");
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    switch (dbColor) {
      case "red":
        setColor("bg-red-400");
        setplaceholderColor("placeholder:text-gray-800");
        setFontColor("text-secondary");
        break;
      case "blue":
        setColor("bg-blue-500");
        setFontColor("!text-slate-800");
        setplaceholderColor("placeholder:text-gray-800");
        break;
      case "green":
        setColor("bg-green-700");
        setplaceholderColor("placeholder:text-gray-800");
        setFontColor("text-secondary");
        break;
      case "yellow":
        setColor("bg-yellow-300");
        setplaceholderColor("placeholder:text-gray-800");
        setFontColor("text-secondary");
        break;
      default:
        setColor("bg-white");
        setplaceholderColor("placeholder:text-gray-500");
        setFontColor("text-secondary");
        break;
    }
  }, [note?.color]);

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
        const newNote: Note = {
          id: crypto.randomUUID(),
          Content: description,
          created_at: new Date().toISOString(),
          uuid: user.id,
          Title: title,
          Pinned: isPinned,
          updatedAt: new Date().toISOString(),
          Image: imageURL,
          color: dbColor,
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

  const handleColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Color button clicked");
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
        setDBColor("red");
        setColor("bg-red-400");
        setplaceholderColor("placeholder:text-gray-800");
        break;
      case "blue":
        setDBColor("blue");
        setColor("bg-blue-500");
        setFontColor("!text-slate-800");
        setplaceholderColor("placeholder:text-gray-800");
        break;
      case "green":
        setDBColor("green");
        setColor("bg-green-700");
        setplaceholderColor("placeholder:text-gray-800");
        break;
      case "yellow":
        setDBColor("yellow");
        setColor("bg-yellow-300");
        setplaceholderColor("placeholder:text-gray-800");
        break;
      default:
        break;
    }
  };

  const handleColorBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setChangingColor(false);
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    clicked && (
      <div
        className={cn(
          "w-full h-full flex flex-col justify-between p-5 mt-10",
          fontColor
        )}
      >
        <div className="w-full flex justify-center items-start">
          <h2 className="text-md font-bold underline mb-5">
            {note ? "Edit Note" : " New Note"}
          </h2>
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
            className={cn(
              "test-title border-0 !rounded-0 border-b-1  border-primary p-1  placeholder:p-1",
              fontColor,
              placeholderColor
            )}
            placeholder="Title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(
              "test-description resize-none  border-primary h-[100px] border-!rounded-0 p-1 focus:outline-none focus:ring-0 focus:border-primary placeholder:p-1",
              fontColor,
              placeholderColor
            )}
            placeholder="Write Note"
          />
        </div>
        {!changingColor ? (
          <div
            className="bottom-bar flex justify-between items-center w-full p-5"
            ref={bottomToolbar}
          >
            <Button
              variant="outline"
              className="color-picker bottom-button cursor-pointer hover:bg-accent p-2 !rounded-full "
              onClick={(e) => handleColor(e)}
            >
              <IconPalette color="var(--primary)" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsPinned((prev) => !prev)}
              className={cn(
                "pin-button bottom-button cursor-pointer hover:bg-accent p-2 !rounded-full",
                isPinned ? "bg-accent border-black text-white" : ""
              )}
            >
              <IconPin color={cn(isPinned ? "white" : "black")} />
            </Button>

            <Button
              style={{ cursor: "pointer" }}
              variant={"outline"}
              className="image-upload bottom-button cursor-pointer hover:bg-accent p-2 !rounded-full transition "
              onClick={handleButtonClick}
            >
              <IconPhoto size={20} color="var(--primary)" />
              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </Button>
          </div>
        ) : (
          <div className="color-toolbar text-primary opacity-100 mt-5 w-full mb-2 h-10 flex items-center justify-between p-2 transition-opacity duration-300 ease-in-out">
            <Button
              className=" !rounded-full cursor-pointer hover:scale-105 h-8 w-8 flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-transparent"
              style={{ cursor: "pointer" }}
              onClick={(e) => handleColorBack(e)}
              variant={"ghost"}
            >
              <IconCircleX color="black" size={20} />
            </Button>
            <Button
              className="bg-green-300 !rounded-full !p-2 hover:scale-105 h-5 w-5 flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-green-500"
              onClick={(e) => changeColor(e, "green")}
              variant={"ghost"}
            ></Button>
            <Button
              className="bg-red-300 !rounded-full !p-2 hover:scale-105 h-5 w-5 flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-green-500"
              onClick={(e) => changeColor(e, "red")}
              variant={"ghost"}
            ></Button>
            <Button
              className="bg-blue-300 !rounded-full !p-2 hover:scale-105 h-5 w-5 flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-green-500"
              onClick={(e) => changeColor(e, "blue")}
              variant={"ghost"}
            ></Button>
            <Button
              className="bg-yellow-300 !rounded-full !p-2 hover:scale-105 h-5 w-5 flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-green-500"
              onClick={(e) => changeColor(e, "yellow")}
              variant={"ghost"}
            ></Button>
          </div>
        )}
        <div className="button-container justify-end flex w-full">
          <button
            className="save-button bg-primary w-20 text-white hover:text-black hover:bg-secondary transition-all duration-300 ease-in-out rounded-md p-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    )
  );
};
