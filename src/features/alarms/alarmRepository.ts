
import { getDatabase } from "../../database/database";
import {
  Alarm,
  CreateAlarmInput,
} from "./alarmTypes";

type AlarmRow = {
  id: string;
  hour: number;
  minute: number;
  enabled: number;
  label: string;
  repeat_days: string;
  sound_id: string;
  vibration_enabled: number;
  snooze_minutes: number;
  is_premium_feature: number;
  native_schedule_ids: string;
  updated_at: string;
};

function mapRow(row: AlarmRow): Alarm {
  return {
    id: row.id,
    hour: row.hour,
    minute: row.minute,
    enabled: row.enabled === 1,
    label: row.label,
    repeatDays: JSON.parse(row.repeat_days),
    soundId: row.sound_id,
    vibrationEnabled: row.vibration_enabled === 1,
    snoozeMinutes: row.snooze_minutes,
    isPremiumFeature: row.is_premium_feature === 1,
    nativeScheduleIds: JSON.parse(row.native_schedule_ids),
    updatedAt: row.updated_at,
  };
}

export async function getAllAlarms(): Promise<Alarm[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<AlarmRow>(
    "SELECT * FROM alarms ORDER BY hour ASC, minute ASC",
  );

  return rows.map(mapRow);
}

export async function getAlarmById(
  id: string,
): Promise<Alarm | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<AlarmRow>(
    "SELECT * FROM alarms WHERE id = ?",
    [id],
  );

  return row ? mapRow(row) : null;
}

export async function insertAlarm(
  input: CreateAlarmInput,
): Promise<Alarm> {
  const db = await getDatabase();

  const alarm: Alarm = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    hour: input.hour,
    minute: input.minute,
    enabled: true,
    label: input.label.trim() || "Wake up",
    repeatDays: [...input.repeatDays].sort((a, b) => a - b),
    soundId: "default",
    vibrationEnabled: input.vibrationEnabled,
    snoozeMinutes: 5,
    isPremiumFeature: input.isPremiumFeature ?? false,
    nativeScheduleIds: [],
    updatedAt: new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO alarms (
      id, hour, minute, enabled, label, repeat_days,
      sound_id, vibration_enabled, snooze_minutes,
      is_premium_feature, native_schedule_ids, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      alarm.id,
      alarm.hour,
      alarm.minute,
      1,
      alarm.label,
      JSON.stringify(alarm.repeatDays),
      alarm.soundId,
      alarm.vibrationEnabled ? 1 : 0,
      alarm.snoozeMinutes,
      alarm.isPremiumFeature ? 1 : 0,
      JSON.stringify(alarm.nativeScheduleIds),
      alarm.updatedAt,
    ],
  );

  return alarm;
}

export async function updateAlarm(
  alarm: Alarm,
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE alarms SET
      hour = ?,
      minute = ?,
      enabled = ?,
      label = ?,
      repeat_days = ?,
      sound_id = ?,
      vibration_enabled = ?,
      snooze_minutes = ?,
      is_premium_feature = ?,
      native_schedule_ids = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      alarm.hour,
      alarm.minute,
      alarm.enabled ? 1 : 0,
      alarm.label.trim() || "Wake up",
      JSON.stringify(alarm.repeatDays),
      alarm.soundId,
      alarm.vibrationEnabled ? 1 : 0,
      alarm.snoozeMinutes,
      alarm.isPremiumFeature ? 1 : 0,
      JSON.stringify(alarm.nativeScheduleIds),
      new Date().toISOString(),
      alarm.id,
    ],
  );
}

export async function deleteAlarm(id: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    "DELETE FROM alarms WHERE id = ?",
    [id],
  );
}
