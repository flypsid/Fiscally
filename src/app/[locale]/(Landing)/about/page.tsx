import { getTranslations } from "next-intl/server";
import React from "react";

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");
  return (
    <div className="max-w-md mx-auto my-12 bg-background border border-muted rounded-2xl shadow-xl p-8">
      <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>
      <p className="text-lg mb-4">{t("paragraph1")}</p>
      <p className="text-lg">{t("paragraph2")}</p>
    </div>
  );
}
