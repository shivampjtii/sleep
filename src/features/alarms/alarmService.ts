
import {
  deleteAlarm,
  getAllAlarms,
  getAlarmById,
  insertAlarm,
  updateAlarm,
} from "./alarmRepository";

import type { Alarm, CreateAlarmInput } from "./alarmTypes";
import { FREE_ALARM_LIMIT } from "./alarmTypes";

export type AlarmSaveResult =
  | { success: true; alarm: Alarm }
  | {
      success: false;
      reason:
        | "FREE_LIMIT"
        | "PREMIUM_REQUIRED"
        | "INVALID_TIME"
        | "SCHEDULING_FAILED";
    };

/**
 * Load alarms stored locally in SQLite.
 * Does not import or initialize notifications.
 */
export async function loadAlarms(): Promise<Alarm[]> {
  return getAllAlarms();
}

/**
 * Validate an alarm before saving it.
 */
function validateAlarmInput(
  input: CreateAlarmInput,
): boolean {
  return (
    Number.isInteger(input.hour) &&
    input.hour >= 0 &&
    input.hour <= 23 &&
    Number.isInteger(input.minute) &&
    input.minute >= 0 &&
    input.minute <= 59 &&
    Array.isArray(input.repeatDays) &&
    input.repeatDays.every(
      (day) =>
        Number.isInteger(day) &&
        day >= 0 &&
        day <= 6,
    )
  );
}

/**
 * Save a new alarm to SQLite.
 *
 * Notifications are intentionally deferred.
 * Saving an alarm does not mean it will ring yet.
 */
export async function saveNewAlarm(
  input: CreateAlarmInput,
  isPremium: boolean,
): Promise<AlarmSaveResult> {
  if (!validateAlarmInput(input)) {
    return { success: false, reason: "INVALID_TIME" };
  }

  const alarms = await getAllAlarms();

  if (input.repeatDays.length > 0 && !isPremium) {
    return { success: false, reason: "PREMIUM_REQUIRED" };
  }

  if (!isPremium && alarms.length >= FREE_ALARM_LIMIT) {
    return { success: false, reason: "FREE_LIMIT" };
  }

  const alarm = await insertAlarm({
    ...input,
    isPremiumFeature:
      input.repeatDays.length > 0 || alarms.length > 0,
  });

  return { success: true, alarm };
}

/**
 * Change an alarm's enabled state in SQLite.
 *
 * This only changes the saved state.
 * It does not schedule or cancel notifications.
 */
export async function changeAlarmEnabled(
  id: string,
  enabled: boolean,
): Promise<void> {
  const alarm = await getAlarmById(id);

  if (!alarm) {
    throw new Error("Alarm not found.");
  }

  if (alarm.enabled === enabled) {
    return;
  }

  alarm.enabled = enabled;

  // There are no active notification schedules in this
  // temporary implementation.
  alarm.nativeScheduleIds = [];
  alarm.updatedAt = new Date().toISOString();

  await updateAlarm(alarm);
}

/**
 * Delete an alarm from SQLite.
 *
 * Notification cancellation is deferred.
 */
export async function removeAlarm(
  id: string,
): Promise<void> {
  await deleteAlarm(id);
}
