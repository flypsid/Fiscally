"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export const SignInOauthButton = ({
  provider,
  signUp,
}: SignInOauthButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);

    await signIn.social({
      provider,
      callbackURL: "/profile",
      errorCallbackURL: "/auth/login/error",
    });

    setIsPending(false);
  }

  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "GitHub";

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="h-12 bg-primary text-primary-foreground font-semibold rounded-lg text-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full"
    >
      {provider === "google" ? (
        <span className="bg-white rounded p-1 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            ></path>
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
        </span>
      ) : (
        <span className="bg-white rounded p-1 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 256 256"
            fill="none"
          >
            <rect width="256" height="256" fill="none" />
            <path
              d="M128 0C57.308 0 0 57.308 0 128c0 56.548 36.676 104.535 87.535 121.447c6.4 1.176 8.747-2.779 8.747-6.178c0-3.063-.12-13.17-.174-23.889c-35.622 7.74-43.137-15.019-43.137-15.019c-5.822-14.797-14.217-18.729-14.217-18.729c-11.626-7.953.88-7.793.88-7.793c12.857.904 19.627 13.2 19.627 13.2c11.428 19.591 29.995 13.936 37.32 10.664c1.157-8.277 4.47-13.942 8.127-17.146c-28.444-3.24-58.348-14.222-58.348-63.297c0-13.984 5-25.419 13.196-34.393c-1.324-3.242-5.713-16.287 1.25-33.963c0 0 10.75-3.44 35.25 13.125c10.21-2.84 21.17-4.26 32.06-4.31c10.89.05 21.85 1.47 32.07 4.31c24.48-16.565 35.22-13.125 35.22-13.125c6.97 17.676 2.58 30.721 1.26 33.963c8.21 8.974 13.19 20.409 13.19 34.393c0 49.2-29.94 60.03-58.45 63.21c4.6 3.97 8.7 11.77 8.7 23.74c0 17.14-.15 30.96-.15 35.18c0 3.43 2.32 7.39 8.78 6.14C219.33 232.52 256 184.54 256 128C256 57.308 198.692 0 128 0Z"
              fill="#181717"
            />
          </svg>
        </span>
      )}
      Sign {action} with {providerName}
    </Button>
  );
};
