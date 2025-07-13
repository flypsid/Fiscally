import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr"],

  // Used when no locale matches
  defaultLocale: "en",

  pathnames: {
    "/": {
      en: "/",
      fr: "/",
    },
    "/about": {
      en: "/about",
      fr: "/a-propos",
    },
    "/contact": {
      en: "/contact-us",
      fr: "/contactez-nous",
    },
  },
});
