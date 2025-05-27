import { useEffect, useState } from "react";
import { SignIn } from "./Parts/sigin";
import { SignUp } from "./Parts/signup";
import { initializeCanvas } from "./Functions/Canvas";

export const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center relative overflow-hidden background-canvas bg-background">
      <canvas className="canvas" id="backgroundCanvas"></canvas>
      <div className="login-container z-40 relative sm:max-w-[clamp(200px,70dvw,400px)] sm:max-h-[clamp(200px,70dvh,500px)] shadow-[2px_2px_5px_rgba(0,0,0,0.3),-2px_-2px_5px_rgba(0,0,0,0.3)] rounded-[12px] flex items-center justify-center bg-accent text-stone-50 w-[90%] h-auto">
        <SignIn
          isSignUpActive={isSignUpActive}
          setIsSignUpActive={setIsSignUpActive}
        />
        <SignUp
          isSignUpActive={isSignUpActive}
          setIsSignUpActive={setIsSignUpActive}
        />
      </div>
    </div>
  );
};
