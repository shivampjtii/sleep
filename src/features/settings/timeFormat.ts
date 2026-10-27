
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../constants/config";

export type TimeFormat = "12h" | "24h";

// const TIME_FORMAT_KEY = "sleepwise_settings_time_format";

export function formatSleepWiseTime(
  date: Date,
  format: TimeFormat,
): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: format === "12h",
  });
}

export function useTimeFormat() {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12h");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadPreference() {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEYS.timeFormat);;

          if (active && (saved === "12h" || saved === "24h")) {
            setTimeFormat(saved);
          }
        } catch (error) {
          console.warn("Could not load time format preference.", error);
        }
      }

      void loadPreference();

      return () => {
        active = false;
      };
    }, []),
  );

  return timeFormat;
}
