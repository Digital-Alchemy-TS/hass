export type AppleNotificationPush = {
  /**
   * **iOS | MacOS**
   *
   * The sound to play for the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#sounds)
   */
  sound?: "none" | string;

  /**
   * **iOS | MacOS**
   *
   * The badge number to display on the app icon.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#badge)
   */
  badge?: number;

  /**
   * **iOS | MacOS**
   *
   * The interruption level of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#interruption-level)
   */
  interruption_level?: "passive" | "active" | "time-sensitive" | "critical";

  /**
   * **iOS | MacOS**
   *
   * The presentation options for the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#presentation-options)
   */
  presentation_options?: ["alert" | "badge" | "sound"];
};

export type NotificationAction = {
  /**
   * Key passed back in events.
   * When set to `REPLY`, you will be prompted for text to send with the event.
   */
  action: "REPLY" | "URI" | string;
  /**
   * Shown on the action button to the user.
   */
  title: string;
  /**
   * The URI to open when selected.
   * Android requires setting the action string to `URI` to use this key. [More Info](https://companion.home-assistant.io/docs/notifications/actionable-notifications/#uri-values).
   */
  uri?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type AndroidNotificationActionOptions = {};

export type AppleNotificationActionOptions = {
  /**
   * **iOS | MacOS**
   *
   * Set to `foreground` to launch the app when tapped. Defaults to background which just fires the event.
   * This is automatically set to foreground when providing a uri.
   */
  activationMode?: "foreground" | "background";
  /**
   * **iOS | MacOS**
   *
   * Set to `true` to require a password to fire the event.
   */
  authenticationRequired?: boolean;
  /**
   * **iOS | MacOS**
   *
   * Set to `true` to color the actions title red.
   */
  destructive?: boolean;
  /**
   * **iOS | MacOS**
   *
   * Set to `textInput` to prompt for text to return with the event. This also occurs when setting the action to `REPLY`.
   */
  behavior?: "textInput";
  /**
   * **iOS | MacOS**
   *
   * Title to use for text input for actions that prompt.
   */
  textInputButtonTitle?: string;
  /**
   * **iOS | MacOS**
   *
   * Placeholder to use for text input for actions that prompt.
   */
  textInputPlaceholder?: string;
  /**
   * **iOS | MacOS**
   *
   * The icon to use for the notification.
   * * [More info](https://companion.home-assistant.io/docs/notifications/actionable-notifications#icon-values)
   */
  icon?: string;
};

export type AppleNotificationData = {
  /**
   * **iOS | MacOS**
   *
   * The URL to open when the notification is clicked.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#opening-a-url)
   */
  url?: string;

  /**
   * **iOS | MacOS**
   *
   * The subtitle of the notification. Shows under the title.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#subtitle--subject)
   */
  subtitle?: string;
  push?: AppleNotificationPush;
  /**
   * iOS Suports ~10 actions.
   */
  actions: Array<NotificationAction & AppleNotificationActionOptions>;
};

export type AndroidNotificationData = {
  /**
   * **Android**
   *
   * The action to perform when the notification is clicked.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#opening-a-url)
   */
  clickAction?: string;

  /**
   * **Android**
   *
   * The subject of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#subtitle--subject)
   */
  subject?: string;

  /**
   * **Android**
   *
   * The color of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-color)
   */
  color?: string;

  /**
   * **Android**
   *
   * Whether the notification should be sticky (persistent).
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#sticky-notification)
   */
  sticky?: boolean;

  /**
   * **Android**
   *
   * The channel to which the notification belongs.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-channels)
   */
  channel?: string;

  /**
   * **Android**
   *
   * The importance level of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-channel-importance)
   */
  importance?: "none" | "min" | "low" | "default" | "high" | "max";

  /**
   * **Android**
   *
   * The vibration pattern of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-vibration-pattern)
   */
  vibrationPattern?: string;

  /**
   * **Android**
   *
   * The LED color of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-led-color)
   */
  ledColor?: string;

  /**
   * **Android**
   *
   * Whether the notification should be persistent.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#persistent-notification)
   */
  persistent?: boolean;

  /**
   * **Android**
   *
   * The timeout duration of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-timeout)
   */
  timeout?: number;

  /**
   * **Android**
   *
   * The URL of the notification icon.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-icon)
   */
  icon_url?: string;

  /**
   * **Android**
   *
   * The visibility of the notification on the lock screen.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-sensitivity--lock-screen-visibility)
   */
  visibility?: "public" | "private" | "secret";
  /**
   * **Android**
   *
   * The text to be spoken by text-to-speech notifications.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#text-to-speech-notifications)
   */
  tts_text?: string;

  /**
   * **Android**
   *
   * The media stream to be played by the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#text-to-speech-notifications)
   */
  media_stream?: "alarm_stream" | "alarm_stream_max";

  /**
   * **Android**
   *
   * Whether the notification should display a chronometer.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#chronometer-notifications)
   */
  chronometer?: boolean;

  /**
   * **Android**
   *
   * The timestamp to display in the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#chronometer-notifications)
   */
  when?: number;

  /**
   * **Android**
   *
   * Whether the notification should only alert once.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#alert-once)
   */
  alert_once?: boolean;

  /**
   * **Android**
   *
   * The status bar icon of the notification.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#notification-status-bar-icon)
   */
  notification_icon?: string;

  /**
   * **Android**
   *
   * Whether the notification should be displayed in the car UI.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#android-auto-visibility)
   */
  car_ui?: boolean;

  /**
   * Android Suports 3 actions.
   */
  actions: Array<NotificationAction & AndroidNotificationActionOptions>;
};

export type NotificationData = {
  /**
   * The group to which the notification belongs.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#grouping)
   */
  group?: string;

  /**
   * The tag to identify the notification for replacement by another.
   * [More info](https://companion.home-assistant.io/docs/notifications/notifications-basic#replacing)
   */
  tag?: string;
};
