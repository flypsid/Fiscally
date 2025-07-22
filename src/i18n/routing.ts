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
    "/dashboard": {
      en: "/dashboard",
      fr: "/tableau-de-bord",
    },
    "/login": {
      en: "/login",
      fr: "/connexion",
    },
    "/register": {
      en: "/register",
      fr: "/inscription",
    },
    "/forgot-password": {
      en: "/forgot-password",
      fr: "/mot-de-passe-oublie",
    },
    "/contact": {
      en: "/contact-us",
      fr: "/contactez-nous",
    },
  },
});
