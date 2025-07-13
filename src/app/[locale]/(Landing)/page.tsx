import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Homepage = () => {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 text-center bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              {t("heroTitle")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Button size="lg" asChild>
                <Link href="/dashboard">{t("dashboardButton")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">{t("contactButton")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
