"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FaGoogle, FaDiscord } from "react-icons/fa";

export default function RegisterPage() {
  const t = useTranslations("Auth");

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const handleDiscordSignIn = async () => {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/dashboard",
    });
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-4 md:py-8 lg:py-16 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-4 pb-3 md:p-6 md:pb-4">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image
                src="/images/flogo-nobg.png"
                alt="Fiscally Logo"
                width={40}
                height={40}
                className="mx-auto mb-2"
                priority
              />
            </Link>
            <h1 className="text-title mb-1 mt-3 text-xl font-semibold">
              {t("registerTitle")}
            </h1>
            <p className="text-sm">{t("registerWelcome")}</p>
          </div>

          <div className="mt-3 md:mt-4">
            <div className="grid grid-cols-2 gap-3 mb-3 md:mb-4">
            <Button type="button" variant="outline" onClick={handleGoogleSignIn}>
              <FaGoogle className="mr-2 flex-shrink-0" size={16} />
              <span>Google</span>
            </Button>
            <Button type="button" variant="outline" onClick={handleDiscordSignIn}>
              <FaDiscord className="mr-2 flex-shrink-0" size={16} style={{color: '#5865F2'}} />
              <span>Discord</span>
            </Button>
            </div>

            <div className="my-3 md:my-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <hr className="border-dashed" />
              <span className="text-muted-foreground text-xs">
                {t("orContinueWith")}
              </span>
              <hr className="border-dashed" />
            </div>

            <RegisterForm />
          </div>
        </div>

        <div className="p-2 md:p-3">
          <p className="text-accent-foreground text-center text-sm">
            {t("alreadyHaveAccount")}
            <Button asChild variant="link" className="px-2">
              <Link href="/login">{t("signIn")}</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
