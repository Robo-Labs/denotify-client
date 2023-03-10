import { NotificationRawConfig } from "./notification.js";
import * as yup from "yup";

// Simple Config
export type DiscordWebhook = {
  url: string;
  username?: string;
  avatar_url?: string;
  message: string;
};

// Raw Config
export type NotifyDiscordWebhookRawId = "notify_discord_webhook";
export const NOTIFY_DISCORD_WEBHOOK_RAW_ID = "notify_discord_webhook";

export type NotifyDiscordWebhookRawConfig = {
  url: string;
  username?: string;
  avatar_url?: string;
  message: string;
};

export type NotifyDiscordWebhookRawResponse = {
  id: number;
  created_at: string;
  url: string;
  username: string;
  avatar_url: string;
  message: string;
};

export type NotifyDiscordWebhookRawUpdate = {
  url?: string;
  username?: string;
  avatar_url?: string;
  message?: string;
};

export class NotifyDiscordWebhook {
  public static SimpleToRaw(config: DiscordWebhook): NotificationRawConfig {
    return {
      name: "", // deprecated
      notify_type: NOTIFY_DISCORD_WEBHOOK_RAW_ID,
      notify: config,
    };
  }

  public static validateCreate(options: any) {
    const urlRegex =
      /^(https?|ftp):\/\/(-\.)?([^\s/?\.#]+\.?)+([^\s\.?#]+)?(\?\S*)?$/;
    const schema = yup.object({
      url: yup.string().matches(urlRegex, "url is not a valid url").required(),
      username: yup.string(),
      avatar_url: yup.string().matches(urlRegex, "url is not a valid url"),
      message: yup.string().required(),
    });
    return schema.validate(options);
  }
}
