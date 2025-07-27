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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>{t("personalInfo")}</CardTitle>
          <CardDescription>
            Update your personal information and profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt={formData.name} />
              <AvatarFallback className="text-lg">
                {formData.name ? getInitials(formData.name) : <IconUser className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label>{t("avatar")}</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <IconCamera className="mr-2 h-4 w-4" />
                  {t("changeAvatar")}
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isLoading}
                  >
                    <IconTrash className="mr-2 h-4 w-4" />
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
          
          <Separator />
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("namePlaceholder")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                  });
                  setAvatarUrl(user?.image || "");
                  setErrors({});
                }}
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : t("save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}