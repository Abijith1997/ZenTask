import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { supabase } from "../../../supabaseClient";
import { IconArrowLeft } from "@tabler/icons-react";
import { handleBackClick } from "../Functions/Functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formSchema } from "./formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SignUpFormValues {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

interface Props {
  isSignUpActive: boolean;
  setIsSignUpActive: (value: boolean) => void;
}

export const SignUp = ({ isSignUpActive, setIsSignUpActive }: Props) => {
  const button =
    "border-1 text-xs border-background bg-background hover:border-1 transition-all hover:border-background hover:bg-secondary hover:text-primary hover:transition-all";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const { email, password } = values;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/#", // Change this to your desired URL
        },
      });
      if (error) {
        console.error("Error signing up:", error.message);
        throw new Error(error.message);
      }
      const user = data?.user;

      if (user) {
        console.log("User profile updated successfully!");
        console.log(user);
      }
    } catch (error) {
      console.error("Error signing up user:", (error as Error).message);
    }
  };

  return (
    <div
      className={`${
        isSignUpActive
          ? "opacity-100 translate-x-0 "
          : "opacity-0 translate-x-100"
      } absolute sign-up  transition-transform ease-in-out duration-300 flex flex-col items-center justify-center gap-5 w-[100%] h-[100%] `}
    >
      <div className="absolute back-arrow-container  w-[100%] h-[100%] top-5 left-5">
        <Button
          className={`${button} back-arrow absolute `}
          onClick={() => handleBackClick({ isSignUpActive, setIsSignUpActive })}
        >
          <IconArrowLeft></IconArrowLeft>
        </Button>
      </div>
      <div className="signup-form flex flex-col items-center justify-center w-[80%] h-[90%] mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-7 w-full "
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className=" w-[80%]">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="border-none shadow-sm placeholder:text-primary placeholder:text-xs bg-secondary"
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className=" w-[80%]">
                  <FormLabel htmlFor="displayName">Display Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border-none shadow-sm placeholder:text-primary placeholder:text-xs bg-secondary"
                      placeholder="displayName"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-[80%]">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border-none shadow-sm placeholder:text-primary placeholder:text-xs bg-secondary"
                      placeholder="Enter Password..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-[80%]">
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border-none shadow-sm placeholder:text-primary placeholder:text-xs bg-secondary"
                      placeholder="Confirm Password..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className={button} type="submit">
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
