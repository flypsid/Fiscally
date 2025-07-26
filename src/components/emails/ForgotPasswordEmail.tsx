/* eslint-disable @next/next/no-head-element */
import * as React from 'react';

interface ForgotPasswordEmailProps {
  userName: string;
  resetUrl: string;
  locale: 'en' | 'fr';
}

const translations = {
  en: {
    subject: 'Reset your password',
    title: 'Reset your password',
    greeting: 'Hello',
    message: 'You requested to reset your password. Click the button below to reset it:',
    buttonText: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    noRequest: "If you didn't request this, please ignore this email.",
    footer: 'Best regards,\nThe Fiscally Team'
  },
  fr: {
    subject: 'Réinitialisez votre mot de passe',
    title: 'Réinitialisez votre mot de passe',
    greeting: 'Bonjour',
    message: 'Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour le réinitialiser :',
    buttonText: 'Réinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    noRequest: "Si vous n'avez pas fait cette demande, veuillez ignorer cet email.",
    footer: 'Cordialement,\nL\'équipe Fiscally'
  }
};

export function ForgotPasswordEmail({ userName, resetUrl, locale }: ForgotPasswordEmailProps) {
  const t = translations[locale];

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.subject}</title>
      </head>
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333333',
        backgroundColor: '#f8f9fa',
        margin: 0,
        padding: 0
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '32px 24px',
            textAlign: 'center' as const
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dvc22eldv/image/upload/v1753544352/logo_zq36nx.png"
              alt="Fiscally Logo"
              style={{
                height: '40px',
                width: 'auto',
                marginBottom: '8px'
              }}
            />
            <h1 style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: 0
            }}>
              Fiscally
            </h1>
          </div>

          {/* Content */}
          <div style={{
            padding: '32px 24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              {t.title}
            </h2>

            <p style={{
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              {t.greeting} {userName},
            </p>

            <p style={{
              fontSize: '16px',
              marginBottom: '24px'
            }}>
              {t.message}
            </p>

            {/* Reset Button */}
            <div style={{
              textAlign: 'center' as const,
              marginBottom: '24px'
            }}>
              <a
                href={resetUrl}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                {t.buttonText}
              </a>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              {t.expiry}
            </p>

            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              {t.noRequest}
            </p>

            <p style={{
              fontSize: '16px',
              whiteSpace: 'pre-line' as const
            }}>
              {t.footer}
            </p>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '16px 24px',
            textAlign: 'center' as const
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: 0
            }}>
              © 2024 Fiscally. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

export default ForgotPasswordEmail;