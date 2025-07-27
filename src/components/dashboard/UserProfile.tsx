"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { IconCamera, IconTrash, IconUser } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

// Schéma de validation pour le profil
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function UserProfile() {
  const t = useTranslations("Dashboard.profile");
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.image || "");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  // Générer les initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Gérer le changement d'avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error(t("uploadError"));
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsLoading(true);
      
      // Créer une URL temporaire pour l'aperçu
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);
      
      // TODO: Implémenter l'upload vers un service de stockage
      // Pour l'instant, on simule juste l'upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(t("uploadError"));
      setAvatarUrl(user?.image || "");
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer l'avatar
  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gérer les changements du formulaire
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Valider les données
      const validatedData = profileSchema.parse(formData);
      setErrors({});
      
      setIsLoading(true);
      
      // Appeler l'API de mise à jour du profil
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(t("updateSuccess"));
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Erreurs de validation
        const fieldErrors: Partial<ProfileFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ProfileFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Profile update error:", error);
        toast.error(t("updateError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{t("personalInfo")}</CardTitle>
          <CardDescription className="text-sm">
            Update your personal information and profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt={formData.name} />
              <AvatarFallback className="text-sm">
                {formData.name ? getInitials(formData.name) : <IconUser className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <Label className="text-sm block">{t("avatar")}</Label>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="h-8 px-3 text-xs"
                >
                  <IconCamera className="mr-1 h-3 w-3" />
                  {t("changeAvatar")}
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isLoading}
                    className="h-8 px-3 text-xs"
                  >
                    <IconTrash className="mr-1 h-3 w-3" />
                    {t("removeAvatar")}
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
          
          <Separator className="my-3" />
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("namePlaceholder")}
                  disabled={isLoading}
                  className="h-9"
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  disabled={isLoading}
                  className="h-9"
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-2">
              <Button type="submit" disabled={isLoading} size="sm" className="h-8 px-3 text-sm flex-1 sm:flex-none">
                {isLoading ? "Saving..." : t("save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                  });
                  setAvatarUrl(user?.image || "");
                  setErrors({});
                }}
                disabled={isLoading}
                className="h-8 px-3 text-sm flex-1 sm:flex-none"
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}