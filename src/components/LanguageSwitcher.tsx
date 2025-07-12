"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import React from "react";
import { FaGlobe } from "react-icons/fa";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-2 ml-4">
      <FaGlobe className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      <div className="relative">
        <select
          value={locale}
          onChange={handleChange}
          className="pl-3 pr-8 py-2 rounded border border-gray-300 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 transition appearance-none"
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
