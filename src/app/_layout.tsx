
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "../constants/colors";
import {
  initializeAlarmNotifications,
} from "../features/alarms/notificationScheduler";

export default function RootLayout() {
  useEffect(() => {
    initializeAlarmNotifications().catch((error) => {
      console.error("Notification initialization failed:", error);
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: "fade",
        }}
      />
    </>
  );
}
