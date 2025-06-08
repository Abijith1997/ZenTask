import { handleGeminiSaveProps, invokeGeminiProps } from "@/Interface/Types";
import { updateTaskInDB } from "@/Slices/TodoSlice";
import { supabase } from "@/supabaseClient";
import { GoogleGenAI } from "@google/genai";

export const invokeGemini = async ({
  setGenerateNew,
  setResponse,
  response,
  setLoading,
  e,
  task,
}: invokeGeminiProps) => {
  const VITE_GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY!;
  const ai = new GoogleGenAI({
    apiKey: VITE_GEMINI_API_KEY,
  });

  setGenerateNew(true);
  e.preventDefault();
  setLoading(true);
  const timeNow = new Date();
  const timeOffset = timeNow.getTimezoneOffset();
  const generalPrompt = `The current time is ${timeNow.toString()} (with timezone offset ${timeOffset} minutes from UTC). 
My task is titled "${task.Title}"${
    task.description ? `, with the description: ${task.description}` : ""
  }${task.Due ? `, and it is due at ${task.Due}` : ""}. 
Provide an approach to finish the task in the given time I have.
Respond with an HTML snippet inside a <div> (do not include <html>, <head>, <style> <script>, or <body> tags). 
Use relevant classes and nested tags for structure and styling, but don't provide styling. 
Speak casually and naturally as if you're talking to a person. 
When referencing time, convert it to my **local timezone**, and phrase it in a human-friendly way (e.g., "tomorrow at 4 PM"). 
**Do not** mention UTC, GMT, or other timezone acronyms.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: generalPrompt,
            },
          ],
        },
      ],
    });
    let cleanedResponse = "";
    if (response.text) {
      cleanedResponse = response.text
        .replace(/<!DOCTYPE html>.*<body>/s, "") // Remove everything before <body>
        .replace(/<\/body>.*<\/html>/s, "") // Remove everything after </body>
        .replace(/```html/s, "") // Remove ```html
        .replace(/```/s, "") // Remove ```
        .replace(/<script>.*<\/script>/s, "") // Remove any <script> tags
        .replace(/"/g, "'") // Replace all double quotes with single quotes
        .replace(/\n/g, "") // Remove all newline characters
        .replace(/<body>/g, "") // Remove <body> tag
        .replace(/<\/body>/g, ""); // Remove </body> tag
    }
    setResponse(cleanedResponse);
  } catch (error) {
    console.error("Gemini error:", error);
  } finally {
    setLoading(false);
    console.log("response", response);
  }
};

export const handleGeminiSave = async ({
  response,
  dispatch,
  task,
}: handleGeminiSaveProps) => {
  console.log("In handle gemini save");

  let geminiURL = "";
  if (response) {
    const uuid = crypto.randomUUID();
    const fileName = `gemini-response-${uuid}.txt`;
    const blob = new Blob([response], { type: "text/plain" });
    const { data, error } = await supabase.storage
      .from("geminiresponse")
      .upload(fileName, blob);
    if (error) {
      console.error("Error uploading chat:", error.message);
    } else {
      console.log(data);
      const { data: url } = supabase.storage
        .from("geminiresponse")
        .getPublicUrl(fileName);
      geminiURL = url.publicUrl;
    }
    try {
      const TaskUpdate = {
        id: task.id,
        updates: {
          Gemini_ID: geminiURL, // store the string here instead
        },
      };
      const result = await dispatch(updateTaskInDB(TaskUpdate)).unwrap();
      console.log("Note inserted:", result);
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  }
};
