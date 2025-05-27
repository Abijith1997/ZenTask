import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Task } from "@/Interface/Types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSend } from "@tabler/icons-react";

interface GeminiProps {
  homeTasks: Task[];
}

export const Gemini = ({ homeTasks }: GeminiProps) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const VITE_GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY!;

  const ai = new GoogleGenAI({
    apiKey: VITE_GEMINI_API_KEY,
  });

  const generateGeminiResponse = async () => {
    setLoading(true);
    const timeNow = new Date();
    const timeOffset = timeNow.getTimezoneOffset();
    console.log(timeOffset);
    console.log(
      homeTasks.map((task) => {
        if (task.Due) new Date(task.Due);
      })
    );
    console.log(timeNow);
    let taskPrompt = "";
    let count = 1;
    const filteredTasks = homeTasks.filter((task) => !task.completed);
    if (filteredTasks.length === 0) {
      taskPrompt = `All my tasks are done. Provide a welcoming message to the app "ZenTask". Do not return time and date. It is already there in my app.`;
    } else {
      taskPrompt = filteredTasks
        .map((task) => {
          if (task.Due)
            return `My ${count++} task is ${task.Title} ${
              task.description ? `with description ${task.description}` : ""
            } which is due at ${new Date(task.Due).toLocaleString()}.`;
        })
        .join(" ");
    }
    const generalPrompt = `The current time is ${timeNow.toString()} (with timezone offset ${timeOffset} minutes from UTC). 
    Provide the response as a html body element. 
    Omit the head, html, and body tags. 
    Don't provide background colors, shadows and anything related to style. 
    Only provide answers inside div elements using classes and relevant inner tags. 
    This is for use in a dynamic webpage. 
    Also if sending back time, say the time as a normal person. Use my timezone and omit the usage of UTC, CET etc.
    The content should be as you talk to a human.
    Also add text-xs classname to every element.`;
    console.log(taskPrompt);
    console.log(generalPrompt);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: question
                  ? taskPrompt.concat(generalPrompt).concat(question)
                  : taskPrompt.concat(generalPrompt),
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
    }
  };

  const handleGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    generateGeminiResponse();
  };

  useEffect(() => {
    generateGeminiResponse();
  }, [homeTasks]);

  return (
    <>
      <div className="whole-gemini w-full sm:w-[100%]  p-2 sm:p-4 flex flex-col items-center justify-center gap-2 z-0">
        <form
          onSubmit={handleGemini}
          className="gemini-form w-[90%] p-4 flex justify-center items-center gap-2"
        >
          <Input
            className="gemini-input flex-1 max-w-[90%] sm:placeholder:text-xs text-[0.75rem] border-2 border-black/40"
            placeholder="Ask something like 'Help me prioritize...'"
            type="text"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            className="gemini-ask-button mt-[20] h-[35px] sm:text-xs text-[0.75rem] bg-blue-400 hover:bg-blue-500 text-white flex"
            type="submit"
          >
            <span className="sm:flex hidden">Ask Gemini</span>
            <span className="sm:hidden transform rotate-[45deg]">
              <IconSend />
            </span>
          </Button>
        </form>

        {loading ? (
          <span className="gemini-loading w-[80%] sm:w-full h-[200px] rounded-[8px]">
            {loading}
          </span>
        ) : response ? (
          <div className="gemini-response w-[80%] sm:w-full h-fit-content sm:max-h-[200px] rounded-[8px] sm:mb-10 bg-[#e8e9e2] p-1 overflow-auto text-[var(--text-color)] sm:text-xs relative z-10">
            <div className="relative z-10 w-full h-full bg-[#e8e9e2] p-2 sm:p-10 ">
              <div
                className="response-content"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
