
import { Platform } from "react-native";
import { Alarm } from "./alarmTypes";

/**
 * Notifications are temporarily disabled while SleepWise
 * runs in Expo Go. Re-enable after configuring a compatible
 * native development environment.
 */

export async function initializeAlarmNotifications(): Promise<void> {
  // Intentionally disabled.
}

export async function requestAlarmPermission(): Promise<boolean> {
  // Notifications are unavailable in the current configuration.
  return false;
}

export async function cancelScheduledAlarm(
  scheduleIds: string[],
): Promise<void> {
  // No scheduled notifications to cancel.
}

export async function scheduleAlarmNotifications(
  alarm: Alarm,
): Promise<string[]> {
  if (Platform.OS === "web") {
    throw new Error("Alarm notifications require a native platform.");
  }

  throw new Error(
    "Alarm notifications are temporarily disabled in this Expo Go build.",
  );
}
