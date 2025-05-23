import {
  IconFileDescription,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { User } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { taskSchema } from "./taskSchema";
import { AppDispatch } from "@/Store";
import { supabase } from "@/supabaseClient";
import { insertTasks } from "@/Slices/TodoSlice";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { DateTimePicker } from "./DateTime/DateTime";
import { Task } from "@/Interface/Types";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

interface AddTaskProps {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
  dateRef?: React.RefObject<HTMLDivElement | null>;
  selectingDate: boolean;
  setSelectingDate: (value: boolean) => void;
}

export const AddTask = ({
  clicked,
  setClicked,
  dateRef,
  selectingDate,
  setSelectingDate,
}: AddTaskProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      Title: "",
      description: "",
      Due: "",
      id: "",
      uid: "",
      completed: false,
      created_at: new Date().toISOString(),
    },
  });

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;
      setUser(data?.user);
      return data.user;
    };
    getUser();
  }, []);

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    if (user) {
      try {
        console.log("inside try block");
        const newTask: Task = {
          id: crypto.randomUUID(),
          uid: user.id,
          Title: data.Title,
          description: data.description || "",
          completed: false,
          created_at: new Date().toISOString(),
          Due: formattedTime || null,
          Gemini_ID: null,
        };

        dispatch(insertTasks(newTask));
        setClicked(false);
      } catch (err: unknown) {
        console.error("Error adding task:", err);
      }
    }
  };

  useEffect(() => {
    if (selectedTime) {
      const formatted = new Date(selectedTime).toISOString(); // ISO string format
      setFormattedTime(formatted);
      console.log("Formatted Time: ", formatted); // Log the formatted time
    }
  }, [selectedTime]);

  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(errors); // Log errors to check if anything is preventing submission
  }, [errors]);

  return (
    clicked && (
      <div className="task-inputflex flex-col items-center justify-center gap-10 w-full h-full ">
        <h1 className="unset add-task-title capitalize w-full text-center p-5 font-semibold mb-5 text-[var(--text-color)] !text-2xl border-b-1">
          Add new task
        </h1>
        <FormProvider {...form}>
          <form
            className="submit-form p-5 max-h-[400px] w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="Title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="task-text ml-0 text-[var(--text-color)] placeholder:text-md placeholder:text-primary"
                      placeholder="Enter Task..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-3 p-2 flex flex-col gap-2 justify-start items-start">
              <div
                className="flex gap-2 justify-start items-start w-auto !relative"
                onClick={() => setSelectingDate(!selectingDate)}
              >
                <DateTimePicker
                  setSelectedTime={setSelectedTime}
                  dateRef={dateRef}
                />
              </div>

              <Collapsible className="flex gap-2 justify-start items-start w-full">
                <CollapsibleTrigger asChild className="flex">
                  <Button className="extra-button addtask-extra-button w-10 h-10 p-2 !rounded-sm">
                    <IconFileDescription
                      size={20}
                      className="add-description-icon"
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent
                  asChild
                  className="flex w-full justify-start items-start"
                >
                  <div className="collapse-box flex-1 min-h-[100px]">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Textarea
                              className="task-textarea resize-none w-full h-full p-2 placeholder:text-xs text-[var(--text-color)]"
                              placeholder="Add Description..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <div className="submit-container flex items-center justify-end gap-2 mt-2">
              <Button className="task-add-button rounded-md" type="submit">
                <IconSquareRoundedPlusFilled
                  className="add-icon"
                  size={25}
                  stroke={1.5}
                />
                <p className="add-task-text">Add Task</p>
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    )
  );
};
