import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const t = useTranslations("HomePage");
  return (
    <nav className="w-full bg-background border-b border-muted/60 shadow-sm ">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/about"
            className="text-base font-medium text-foreground hover:text-primary transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="text-base font-medium text-foreground hover:text-primary transition-colors"
          >
            {t("contact")}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
