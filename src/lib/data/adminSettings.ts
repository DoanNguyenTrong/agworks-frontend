
import { AdminSettings } from "@/lib/types";

export const adminSettings: AdminSettings = {
  general: {
    systemName: "AgWorks",
    supportEmail: "support@agworks.com",
    logoUrl: "/logo.png",
    enablePublicRegistration: true,
    enableWorkerSelfRegistration: true,
  },
  email: {
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "username",
    smtpPassword: "password",
    senderEmail: "no-reply@agworks.com",
    senderName: "AgWorks System",
  },
  security: {
    twoFactorAuth: false,
    passwordExpiration: false,
    accountLockout: true
  },
  integrations: {
    googleMaps: false,
    twilioSMS: false,
    stripePayments: false
  }
};
