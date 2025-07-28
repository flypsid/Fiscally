import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailChangeNotificationEmailProps {
  userName: string;
  oldEmail: string;
  newEmail: string;
  supportUrl: string;
  locale: string;
}

const translations = {
  en: {
    preview: "Your email address has been changed",
    greeting: "Hello",
    title: "Email Address Change Notification",
    message1:
      "This is to inform you that your email address has been successfully changed.",
    oldEmailLabel: "Previous email:",
    newEmailLabel: "New email:",
    message2: "If you made this change, no further action is required.",
    message3:
      "If you did not request this change, your account may have been compromised. Please contact our support team immediately.",
    buttonText: "Contact Support",
    message4: "For your security, we recommend:",
    recommendation1: "• Changing your password immediately",
    recommendation2: "• Reviewing your recent account activity",
    recommendation3:
      "• Enabling two-factor authentication if not already active",
    footer: "Best regards,\nThe Fiscally Team",
  },
  fr: {
    preview: "Votre adresse e-mail a été modifiée",
    greeting: "Bonjour",
    title: "Notification de Changement d'Adresse E-mail",
    message1:
      "Nous vous informons que votre adresse e-mail a été modifiée avec succès.",
    oldEmailLabel: "Ancienne adresse :",
    newEmailLabel: "Nouvelle adresse :",
    message2:
      "Si vous avez effectué ce changement, aucune action supplémentaire n'est requise.",
    message3:
      "Si vous n'avez pas demandé ce changement, votre compte pourrait être compromis. Veuillez contacter notre équipe de support immédiatement.",
    buttonText: "Contacter le Support",
    message4: "Pour votre sécurité, nous recommandons :",
    recommendation1: "• Changer votre mot de passe immédiatement",
    recommendation2: "• Vérifier l'activité récente de votre compte",
    recommendation3:
      "• Activer l'authentification à deux facteurs si ce n'est pas déjà fait",
    footer: "Cordialement,\nL'équipe Fiscally",
  },
};

export const EmailChangeNotificationEmail = ({
  userName,
  oldEmail,
  newEmail,
  supportUrl,
  locale = "en",
}: EmailChangeNotificationEmailProps) => {
  const t =
    translations[locale as keyof typeof translations] || translations.en;

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>Fiscally</Text>
          </Section>
          <Heading style={h1}>{t.title}</Heading>
          <Text style={text}>
            {t.greeting} {userName},
          </Text>
          <Text style={text}>{t.message1}</Text>

          <Section style={emailContainer}>
            <Text style={emailLabel}>{t.oldEmailLabel}</Text>
            <Text style={emailText}>{oldEmail}</Text>
            <Text style={emailLabel}>{t.newEmailLabel}</Text>
            <Text style={emailText}>{newEmail}</Text>
          </Section>

          <Text style={text}>{t.message2}</Text>

          <Section style={warningContainer}>
            <Text style={warningText}>{t.message3}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={supportUrl}>
              {t.buttonText}
            </Button>
          </Section>

          <Text style={text}>{t.message4}</Text>
          <Text style={recommendationText}>{t.recommendation1}</Text>
          <Text style={recommendationText}>{t.recommendation2}</Text>
          <Text style={recommendationText}>{t.recommendation3}</Text>

          <Text style={footer}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const logoContainer = {
  textAlign: "center" as const,
  margin: "0 0 40px",
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1f2937",
  textDecoration: "none",
  margin: "0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const emailContainer = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const emailLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  margin: "8px 0 4px 0",
};

const emailText = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 12px 0",
};

const warningContainer = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  borderRadius: "4px",
  padding: "16px",
  margin: "24px 0",
};

const warningText = {
  color: "#92400e",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#dc2626",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const recommendationText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "4px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
  textAlign: "center" as const,
  whiteSpace: "pre-line" as const,
};

export default EmailChangeNotificationEmail;
