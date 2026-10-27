
import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = initializeDatabase();
  }

  return databasePromise;
}

async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync("sleepwise.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS alarms (
      id TEXT PRIMARY KEY NOT NULL,
      hour INTEGER NOT NULL,
      minute INTEGER NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      label TEXT NOT NULL DEFAULT 'Wake up',
      repeat_days TEXT NOT NULL DEFAULT '[]',
      sound_id TEXT NOT NULL DEFAULT 'default',
      vibration_enabled INTEGER NOT NULL DEFAULT 1,
      snooze_minutes INTEGER NOT NULL DEFAULT 5,
      is_premium_feature INTEGER NOT NULL DEFAULT 0,
      native_schedule_ids TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL
    );
  `);

  return db;
}
