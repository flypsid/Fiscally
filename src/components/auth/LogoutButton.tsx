"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className = "",
  children,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const locale = useLocale();
  const t = useTranslations("Navbar");

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut();
      toast.success("Successfully logged out");
      // Force a full page reload to ensure session is cleared
      window.location.href = `/${locale}`;
    } catch {
      toast.error("Failed to log out");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          {isLoading ? t("loggingOut") : t("logout")}
        </>
      )}
    </Button>
  );
}
