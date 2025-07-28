import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailChangeVerificationEmailProps {
  userName: string;
  newEmail: string;
  verificationUrl: string;
  locale: string;
}

const translations = {
  en: {
    preview: "Verify your new email address",
    greeting: "Hello",
    title: "Verify Your New Email Address",
    message1: "You have requested to change your email address to:",
    message2: "To complete this change, please click the button below to verify your new email address:",
    buttonText: "Verify New Email",
    message3: "This verification link will expire in 24 hours.",
    message4: "If you didn't request this change, please ignore this email or contact our support team.",
    alternativeText: "If the button doesn't work, you can copy and paste this link into your browser:",
    footer: "Best regards,\nThe Fiscally Team",
  },
  fr: {
    preview: "Vérifiez votre nouvelle adresse e-mail",
    greeting: "Bonjour",
    title: "Vérifiez Votre Nouvelle Adresse E-mail",
    message1: "Vous avez demandé à changer votre adresse e-mail vers :",
    message2: "Pour finaliser ce changement, veuillez cliquer sur le bouton ci-dessous pour vérifier votre nouvelle adresse e-mail :",
    buttonText: "Vérifier la Nouvelle Adresse",
    message3: "Ce lien de vérification expirera dans 24 heures.",
    message4: "Si vous n'avez pas demandé ce changement, veuillez ignorer cet e-mail ou contacter notre équipe de support.",
    alternativeText: "Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :",
    footer: "Cordialement,\nL'équipe Fiscally",
  },
};

export const EmailChangeVerificationEmail = ({
  userName,
  newEmail,
  verificationUrl,
  locale = "en",
}: EmailChangeVerificationEmailProps) => {
  const t = translations[locale as keyof typeof translations] || translations.en;

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://res.cloudinary.com/dvc22eldv/image/upload/v1753544352/logo_zq36nx.png"
              alt="Fiscally Logo"
              style={logoImage}
            />
            <Text style={logo}>Fiscally</Text>
          </Section>
          <Heading style={h1}>{t.title}</Heading>
          <Text style={text}>
            {t.greeting} {userName},
          </Text>
          <Text style={text}>{t.message1}</Text>
          <Section style={emailContainer}>
            <Text style={emailText}>{newEmail}</Text>
          </Section>
          <Text style={text}>{t.message2}</Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              {t.buttonText}
            </Button>
          </Section>
          <Text style={text}>{t.message3}</Text>
          <Text style={text}>{t.message4}</Text>
          <Text style={text}>{t.alternativeText}</Text>
          <Link href={verificationUrl} style={link}>
            {verificationUrl}
          </Link>
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

const logoImage = {
  height: "40px",
  width: "auto",
  marginBottom: "8px",
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
  textAlign: "center" as const,
};

const emailText = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const link = {
  color: "#3b82f6",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
  textAlign: "center" as const,
  whiteSpace: "pre-line" as const,
};

export default EmailChangeVerificationEmail;