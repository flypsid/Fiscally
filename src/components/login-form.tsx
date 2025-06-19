"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getLoginSchema } from "./loginSchema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signInEmailAction } from "@/actions/sign-in-email.action";
import { SignInOauthButton } from "./sign-in-oauth-button";

export const LoginForm = () => {
  const t = useTranslations("LoginForm");
  const router = useRouter();
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isPending, setIsPending] = useState(false);

  function mapErrorMessage(error: string) {
    if (error === "Invalid email or password") return t("invalidCredentials");
    return error;
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setErrors({});
    const formData = new FormData(evt.target as HTMLFormElement);
    const values = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const schema = getLoginSchema(t);
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      for (const err of result.error.errors) {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setIsPending(true);
    const { error } = await signInEmailAction(formData);
    setIsPending(false);
    if (error) {
      setErrors({ general: mapErrorMessage(error) });
    } else {
      toast.success(t("loginSuccess"));
      router.push("/profile");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-background border border-muted rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-2 tracking-tight text-foreground">
        {t("title")}
      </h1>
      <p className="text-muted-foreground mb-8 text-base leading-relaxed">
        {t("description")}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium text-foreground">
            {t("email")}
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="font-medium text-foreground">
            {t("password")}
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("passwordPlaceholder")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {errors.general && (
          <span className="text-red-500 text-sm">{errors.general}</span>
        )}

        <Button
          type="submit"
          className="h-12 mt-2 bg-primary text-primary-foreground font-semibold rounded-lg text-lg shadow-sm hover:bg-primary/90 transition-colors"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              {t("submit")}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </span>
          ) : (
            t("submit")
          )}
        </Button>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <hr className="border-dashed" />
          <span className="text-muted-foreground text-xs">
            {t("orContinueWith")}
          </span>
          <hr className="border-dashed" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <SignInOauthButton provider="google" />
          <SignInOauthButton provider="github" />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/auth/register" className="underline hover:text-primary">
            {t("register")}
          </Link>
        </div>
      </form>
    </div>
  );
};
