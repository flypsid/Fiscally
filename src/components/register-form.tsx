"use client";

// import { signUp } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getRegisterSchema } from "./registerSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpEmailAction } from "@/actions/sign-up-email.action";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SignInOauthButton } from "./sign-in-oauth-button";

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});
  const router = useRouter();
  const t = useTranslations("RegisterForm");

  function mapErrorMessage(error: string) {
    if (error === "User already exists") return t("userExists");
    if (error === "Password too short") return t("passwordTooShort");
    return error;
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    const formData = new FormData(evt.currentTarget);
    const values = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      confirmPassword: String(formData.get("confirmPassword") || ""),
    };

    const schema = getRegisterSchema(t);
    const result = schema.safeParse(values);
    if (!result.success) {
      const errors: { [k: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      setIsPending(false);
      return;
    }
    setFormErrors({});

    const { error } = await signUpEmailAction(formData);

    if (error) {
      toast.error(mapErrorMessage(error));
      setIsPending(false);
    } else {
      toast.success(t("registerSuccess"));
      router.push("/auth/login");
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
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" name="name" placeholder={t("namePlaceholder")} />
          {formErrors.name && (
            <p className="text-red-500 text-sm">{formErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder={t("emailPlaceholder")}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("passwordPlaceholder")}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm">{formErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder={t("passwordPlaceholder")}
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 mt-2 w-full bg-primary text-primary-foreground font-semibold rounded-lg text-lg shadow-sm hover:bg-primary/90 transition-colors"
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
          <SignInOauthButton provider="google" signUp />
          <SignInOauthButton provider="github" signUp />
        </div>
        <div className="text-center text-sm ">
          {t("alreadyAccount")}{" "}
          <Link href="/auth/login" className="underline">
            {t("login")}
          </Link>
        </div>
      </form>
    </div>
  );
};
