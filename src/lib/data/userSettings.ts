
import { UserSettings } from "@/lib/types";

export const userSettings: UserSettings[] = [
  {
    userId: "user-1",
    theme: "light",
    emailNotifications: true,
    smsNotifications: false,
    language: "en",
    createdAt: "2023-04-01T08:00:00Z",
    updatedAt: "2023-04-01T08:00:00Z"
  },
  {
    userId: "user-2",
    theme: "light",
    emailNotifications: true,
    smsNotifications: true,
    language: "en",
    createdAt: "2023-04-02T09:00:00Z",
    updatedAt: "2023-04-02T09:00:00Z"
  },
  {
    userId: "user-3",
    theme: "dark",
    emailNotifications: true,
    smsNotifications: false,
    language: "en",
    createdAt: "2023-04-03T10:00:00Z",
    updatedAt: "2023-04-03T10:00:00Z"
  },
  {
    userId: "user-4",
    theme: "system",
    emailNotifications: true,
    smsNotifications: true,
    language: "en",
    createdAt: "2023-04-04T11:00:00Z",
    updatedAt: "2023-04-04T11:00:00Z"
  },
  {
    userId: "user-5",
    theme: "light",
    emailNotifications: false,
    smsNotifications: true,
    language: "es",
    createdAt: "2023-04-05T12:00:00Z",
    updatedAt: "2023-04-05T12:00:00Z"
  }
];
