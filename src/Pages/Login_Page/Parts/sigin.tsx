import { useState } from "react";
import { LogoSVG } from "@/SVG/SVGs";
import { Button } from "@/components/ui/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { handleSignIn, handleSignUp } from "../Functions/Functions";

interface Props {
  isSignUpActive: boolean;
  setIsSignUpActive: (value: boolean) => void;
}

export const SignIn = ({ isSignUpActive, setIsSignUpActive }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const button =
    "border-1 text-xs border-black bg-primary hover:border-1 transition-all hover:border-background hover:bg-secondary hover:text-primary hover:transition-all";

  const onSignIn = async () => {
    const { data, error } = await handleSignIn(email, password);
    if (error) {
      console.error("Unable to sign in.", error);
    } else {
      console.log("User signed in succesfully", data?.user);
      navigate("/");
    }
  };

  const signInWithGoogle = async () => {
    console.log("in sign in function");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`, // This ensures the OAuth flow uses a pop-up and doesn't redirect the user
      },
    });
    navigate("/");
    if (error) {
      console.log("Google sign-in error:", error);
      return { error };
    }
    return { error: null };
  };

  const onGoogleSignIn = async () => {
    const error = await signInWithGoogle();
    if (error) {
      console.error("Unable to sign in with Google.", error);
    } else {
      console.log("User signed in succesfully with Google.");
      navigate("/");
    }
  };
  return (
    <div
      className={`sign-in flex flex-col justify-center items-center gap-4 p-10 ${
        isSignUpActive
          ? "opacity-0 transform -translate-x-full transition-transform"
          : "opacity-100 transform translate-x-0 transition-transform"
      }`}
    >
      <div className="logo-heading flex items-center justify-center gap-2 w-100">
        <div className="w-7 h-7 [&>*]:w-full [&>*]:h-full">
          <LogoSVG fillColor={"#e9ecef"} />
        </div>
        <h3 className="text-3xl font-bold">ZenTask</h3>
      </div>

      <div className="login-heading">
        <h2 className="text-xl font-bold">Login</h2>
      </div>

      <div className="user-input flex flex-col gap-5 w-[clamp(200px,70dvw,300px)] justify-center items-center">
        <Input
          type="text"
          className="username-input border-none shadow-sm placeholder:text-primary placeholder:text-xs bg-secondary"
          name="username"
          placeholder="Username or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          className="password-input border-none shadow-sm placeholder:text-primary placeholder:text-xs bg-secondary"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="forgot-password flex items-center justify-center gap-2 flex-col">
        <Button className={button} onClick={onSignIn}>
          <p className="text-xs">Sign In</p>
        </Button>
        <a
          href="#"
          className="text-xs text-background hover:underline decoration-primary hover:text-secondary"
        >
          Forgot password?
        </a>
      </div>

      <div className="new-user flex flex-col items-center justify-center gap-5">
        <div className="gap-2 flex items-center justify-center text-sm">
          <p className="text-sm">New to ZenTask?</p>
          <Button
            className={button}
            onClick={() => handleSignUp({ isSignUpActive, setIsSignUpActive })}
          >
            Sign Up
          </Button>
        </div>
        <div className="or-container flex flex-col text-sm items-center justify-center gap-2">
          <p>Or sign in using</p>
          <div className="sign-in-methods">
            <Button className={button} onClick={onGoogleSignIn}>
              <p>Sign in with Google</p>
              <IconBrandGoogleFilled
                size={"15"}
                stroke={1}
                className="google-icon"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
