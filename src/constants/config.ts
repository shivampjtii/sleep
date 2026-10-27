
export const APP_CONFIG = {
  name: "SleepWise",
  version: "1.0.0",
  defaultSleepOnsetMinutes: 15,
  minimumSleepOnsetMinutes: 0,
  maximumSleepOnsetMinutes: 60,
  minimumRecommendedSleepHours: 7,
  maximumRecommendedSleepHours: 10,
} as const;

export const STORAGE_KEYS = {
  timeFormat: "sleepwise_settings_time_format",
  vibration: "sleepwise_settings_vibration",
} as const;

export const ALARM_CONFIG = {
  minimumSnoozeMinutes: 1,
  maximumSnoozeMinutes: 30,
  defaultSnoozeMinutes: 5,
} as const;

export const TIME_FORMATS = {
  twelveHour: "12h",
  twentyFourHour: "24h",
} as const;

export type AppTimeFormat =
  (typeof TIME_FORMATS)[keyof typeof TIME_FORMATS];
