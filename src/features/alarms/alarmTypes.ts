
export type Alarm = {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
  label: string;
  repeatDays: number[];
  soundId: string;
  vibrationEnabled: boolean;
  snoozeMinutes: number;
  isPremiumFeature: boolean;
  nativeScheduleIds: string[];
  updatedAt: string;
};

export type CreateAlarmInput = {
  hour: number;
  minute: number;
  label: string;
  repeatDays: number[];
  vibrationEnabled: boolean;
  isPremiumFeature?: boolean;
};

export const FREE_ALARM_LIMIT = 1;

export function formatAlarmTime(alarm: Alarm): string {
  const date = new Date();
  date.setHours(alarm.hour, alarm.minute, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
