import { supabase } from "../../../supabaseClient";

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.log("Google sign-in error:", error);
    return { error };
  }
  return { error: null };
};

interface Props {
  isSignUpActive: boolean;
  setIsSignUpActive: (value: boolean) => void;
}

export const handleSignUp = ({ isSignUpActive, setIsSignUpActive }: Props) => {
  setIsSignUpActive(!isSignUpActive);
  const signIn = document.querySelector(".sign-in") as HTMLElement;
  const signUp = document.querySelector(".sign-up") as HTMLElement;

  if (signIn && signUp) {
    signIn.classList.add("hidden");
    signUp.classList.add("active");
  }
};

export const handleBackClick = ({
  isSignUpActive,
  setIsSignUpActive,
}: Props) => {
  setIsSignUpActive(!isSignUpActive);
  const signIn = document.querySelector(".sign-in") as HTMLElement;
  const signUp = document.querySelector(".sign-up") as HTMLElement;

  if (signIn && signUp) {
    signIn.classList.remove("hidden");
    signUp.classList.remove("active");
  }
};

export const handleSignIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};
