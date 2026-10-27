
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { colors, radius, spacing } from "../../constants/colors";
import {
  changeAlarmEnabled,
  loadAlarms,
  removeAlarm,
} from "../../features/alarms/alarmService";
import {
  formatSleepWiseTime,
  useTimeFormat,
} from "../../features/settings/timeFormat";
import {
  Alarm,
  formatAlarmTime,
} from "../../features/alarms/alarmTypes";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function repeatDescription(days: number[]) {
  if (days.length === 0) return "One time";

  if (days.length === 7) return "Every day";

  if (
    days.length === 5 &&
    [1, 2, 3, 4, 5].every((day) => days.includes(day))
  ) {
    return "Weekdays";
  }

  return days.map((day) => DAY_NAMES[day]).join(", ");
}

export default function AlarmsScreen() {
  const router = useRouter();
  const timeFormat = useTimeFormat();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setAlarms(await loadAlarms());
    } catch {
      Alert.alert("Unable to load alarms", "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  async function toggleAlarm(alarm: Alarm, enabled: boolean) {
    try {
      await changeAlarmEnabled(alarm.id, enabled);
      await refresh();
    } catch {
      Alert.alert("Update failed", "Please try again.");
    }
  }

  function confirmDelete(alarm: Alarm) {
    Alert.alert(
      "Delete alarm?",
      `Remove "${alarm.label}" from your saved alarms?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeAlarm(alarm.id);
              await refresh();
            } catch {
              Alert.alert("Delete failed", "Please try again.");
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹  Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>YOUR MORNING ROUTINE</Text>
        <Text style={styles.title}>My alarms</Text>
        <Text style={styles.subtitle}>
          Manage your saved wake-up times.
        </Text>

        {loading ? (
          <ActivityIndicator
            color={colors.primary}
            size="large"
            style={styles.loader}
          />
        ) : alarms.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyMoon}>☾</Text>
            <Text style={styles.emptyTitle}>A fresh start awaits</Text>
            <Text style={styles.emptyText}>
              Create your first alarm to build a consistent morning
              routine.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {alarms.map((alarm) => (
              <View key={alarm.id} style={styles.alarmCard}>
                <View style={styles.alarmTop}>
                  <View style={styles.alarmTimeGroup}>
                    <Text
                      style={[
                        styles.alarmTime,
                        !alarm.enabled && styles.disabledText,
                      ]}
                    >
                      {formatSleepWiseTime(
  new Date(2000, 0, 1, alarm.hour, alarm.minute),
  timeFormat
)}
                    </Text>
                    <Text style={styles.alarmLabel}>
                      {alarm.label}
                    </Text>
                  </View>

                  <Switch
                    value={alarm.enabled}
                    onValueChange={(value) =>
                      void toggleAlarm(alarm, value)
                    }
                    trackColor={{
                      false: colors.border,
                      true: colors.primaryDark,
                    }}
                    thumbColor={colors.white}
                  />
                </View>

                <Text style={styles.repeatText}>
                  {repeatDescription(alarm.repeatDays)}
                  {alarm.vibrationEnabled ? " · Vibration" : ""}
                </Text>

                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => confirmDelete(alarm)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>

                  <View style={styles.status}>
                    <View
                      style={[
                        styles.statusDot,
                        !alarm.enabled && styles.statusDotOff,
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {alarm.enabled ? "Enabled" : "Disabled"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => router.push("/alarms/create")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+  Create alarm</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Saved alarm settings are stored on this device. Actual alarm
          scheduling will be connected in the next step.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 48,
    paddingBottom: 40,
  },
  back: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 24,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  eyebrow: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 24,
  },
  loader: {
    marginTop: 70,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 15,
  },
  emptyMoon: {
    color: colors.primary,
    fontSize: 48,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  list: {
    gap: 13,
  },
  alarmCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 17,
  },
  alarmTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alarmTimeGroup: {
    flex: 1,
  },
  alarmTime: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "800",
  },
  disabledText: {
    color: colors.textSecondary,
  },
  alarmLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  repeatText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 17,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 15,
    paddingTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 3,
  },
  deleteText: {
    color: "#FF8D9B",
    fontSize: 12,
    fontWeight: "600",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  statusDotOff: {
    backgroundColor: colors.textSecondary,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: "center",
    padding: 18,
    marginTop: 22,
  },
  addButtonText: {
    color: colors.background,
    fontWeight: "800",
    fontSize: 14,
  },
  disclaimer: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 17,
  },
});
