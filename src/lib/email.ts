import { Resend } from "resend";
import { ForgotPasswordEmail } from "@/components/emails/ForgotPasswordEmail";
import { EmailVerificationEmail } from "@/components/emails/EmailVerificationEmail";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendForgotPasswordEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
  locale: "en" | "fr";
}

interface SendVerificationEmailParams {
  to: string;
  userName: string;
  verificationUrl: string;
  locale: "en" | "fr";
}

const getSubject = (
  type: "forgot-password" | "email-verification",
  locale: "en" | "fr"
) => {
  const subjects = {
    "forgot-password": {
      en: "Reset your password - Fiscally",
      fr: "Réinitialisez votre mot de passe - Fiscally",
    },
    "email-verification": {
      en: "Verify your email address - Fiscally",
      fr: "Vérifiez votre adresse email - Fiscally",
    },
  };

  return subjects[type][locale];
};

export async function sendForgotPasswordEmail({
  to,
  userName,
  resetUrl,
  locale,
}: SendForgotPasswordEmailParams) {
  try {
    const emailHtml = await render(
      ForgotPasswordEmail({ userName, resetUrl, locale })
    );

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com", // Domaine temporaire vérifié - permet l'envoi à toutes adresses
      to: [to],
      subject: getSubject("forgot-password", locale),
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending forgot password email:", error);
      throw new Error("Failed to send forgot password email");
    }

    console.log("Forgot password email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendForgotPasswordEmail:", error);
    throw error;
  }
}

export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
  locale,
}: SendVerificationEmailParams) {
  try {
    console.log("Starting email verification send process:", {
      to,
      userName,
      locale,
      hasResendKey: !!process.env.RESEND_API_KEY,
    });

    const emailHtml = await render(
      EmailVerificationEmail({ userName, verificationUrl, locale })
    );

    console.log("Email HTML rendered successfully");

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com", // Domaine temporaire vérifié - permet l'envoi à toutes adresses
      to: [to],
      subject: getSubject("email-verification", locale),
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(
        `Failed to send verification email: ${JSON.stringify(error)}`
      );
    }

    console.log("Verification email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
}

// Fonction utilitaire pour extraire la locale depuis une requête
export function getLocaleFromRequest(request?: Request): "en" | "fr" {
  if (!request) return "en";

  // Essayer d'extraire la locale depuis l'URL
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const locale = pathSegments[1]; // Assuming locale is the first segment

  if (locale === "fr" || locale === "en") {
    return locale;
  }

  // Si la locale n'est pas trouvée dans l'URL, utiliser 'en' par défaut
  // Ne pas se fier à Accept-Language car cela peut causer des incohérences
  return "en"; // Default fallback
}
