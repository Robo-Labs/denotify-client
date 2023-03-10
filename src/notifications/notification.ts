import {
  DiscordWebhook,
  NotifyDiscordWebhook,
  NotifyDiscordWebhookRawConfig,
  NotifyDiscordWebhookRawId,
  NotifyDiscordWebhookRawResponse,
  NotifyDiscordWebhookRawUpdate,
} from "./notify_discord_webhook.js";

// Types user is expossed to
export type NotificationTypeId = "Discord";
export type NotificationConfig = DiscordWebhook;

// Raw Schema Types
export type NotifyRawId = NotifyDiscordWebhookRawId;
export type NotifyRawConfig = NotifyDiscordWebhookRawConfig;
export type NotifyRawResponse = NotifyDiscordWebhookRawResponse;
export type NotifyRawUpdate = NotifyDiscordWebhookRawUpdate;

export type NotificationRawConfig = {
  name: string;
  notify_type: NotifyRawId;
  notify: NotifyRawConfig;
};

export type NotificationRawResponse = {
  notify_type: NotifyRawId;
  notify: NotifyRawResponse;
  error: boolean;
  error_message: string | null;
  error_timestamp: number | null;
};

export class Notification {
  public static SimpleToRaw(
    id: NotificationTypeId,
    config: NotificationConfig
  ): NotificationRawConfig {
    switch (id) {
      case "Discord":
        return NotifyDiscordWebhook.SimpleToRaw(config as DiscordWebhook);
    }
  }
}
