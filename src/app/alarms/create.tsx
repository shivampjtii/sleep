import React, { useState } from "react";
import { saveNewAlarm } from "../../features/alarms/alarmService";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { colors, radius, spacing } from "../../constants/colors";
import { formatTime } from "../../features/sleep/sleepCalculator";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const DAYS = [
  { label: "S", name: "Sun", value: 0 },
  { label: "M", name: "Mon", value: 1 },
  { label: "T", name: "Tue", value: 2 },
  { label: "W", name: "Wed", value: 3 },
  { label: "T", name: "Thu", value: 4 },
  { label: "F", name: "Fri", value: 5 },
  { label: "S", name: "Sat", value: 6 },
];

export default function CreateAlarmScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    wake?: string;
    bedtime?: string;
    sleepHours?: string;
  }>();

  const parsedWake = new Date(params.wake ?? "");
  const initialWake = Number.isNaN(parsedWake.getTime())
    ? new Date()
    : parsedWake;

  const [alarmTime, setAlarmTime] = useState(initialWake);
  const [label, setLabel] = useState("Wake up");
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [vibration, setVibration] = useState(true);

  const [showPicker, setShowPicker] = useState(false);

  function toggleDay(day: number) {
    setRepeatDays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day].sort((a, b) => a - b),
    );
    }



    
async function handleSaveAlarm() {
  try {
    const result = await saveNewAlarm(
      {
        hour: alarmTime.getHours(),
        minute: alarmTime.getMinutes(),
        label: label.trim() || "Wake up",
        repeatDays,
        vibrationEnabled: vibration,
      },
      false, // Premium billing is not integrated yet.
    );

    if (!result.success) {
      if (result.reason === "FREE_LIMIT") {
        Alert.alert(
          "Free alarm limit reached",
          "You can save one alarm for free. Premium will let you create additional alarms.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "View Premium",
              onPress: () => router.push("/premium"),
            },
          ],
        );
      } else if (result.reason === "PREMIUM_REQUIRED") {
        Alert.alert(
          "Premium feature",
          "Recurring alarms require Premium. You can save a one-time alarm for free.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "View Premium",
              onPress: () => router.push("/premium"),
            },
          ],
        );
      } else {
        Alert.alert("Invalid time", "Choose a valid alarm time.");
      }

      return;
    }

    Alert.alert(
      "Alarm saved",
      "Your alarm settings have been saved on this device. The alarm will not ring until native Android scheduling is integrated.",
      [
        {
          text: "View alarms",
          onPress: () => router.replace("/alarms"),
        },
      ],
    );
  } catch {
    Alert.alert(
      "Unable to save alarm",
      "Please try again.",
    );
  }
}

    

    function handleTimeChange(
  event: DateTimePickerEvent,
  selectedDate?: Date,
) {
  if (Platform.OS === "android") {
    setShowPicker(false);
  }

  if (event.type === "set" && selectedDate) {
    setAlarmTime((previous) => {
      const updated = new Date(previous);
      updated.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0,
      );
      return updated;
    });
  }
}

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
        >
          <Text style={styles.backText}>‹  Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>YOUR MORNING STARTS HERE</Text>
        <Text style={styles.title}>Create an alarm</Text>
        <Text style={styles.subtitle}>
          Set your wake-up time and prepare for a better morning.
        </Text>

        <View style={styles.timeCard}>
          <Text style={styles.fieldLabel}>WAKE-UP TIME</Text>

          <Pressable
            onPress={() => setShowPicker((current) => !current)}
            style={styles.timeButton}
          >
            <Text style={styles.timeText}>
              {formatTime(alarmTime)}
            </Text>
            <Text style={styles.editText}>CHANGE ↗</Text>
          </Pressable>

          {showPicker && (
  <DateTimePicker
    value={alarmTime}
    mode="time"
    display={Platform.OS === "ios" ? "spinner" : "clock"}
    onChange={handleTimeChange}
  />
)}

          <Text style={styles.fieldLabel}>ALARM LABEL</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="e.g. Morning routine"
            placeholderTextColor={colors.textSecondary}
            maxLength={40}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repeat</Text>
          <Text style={styles.subtitle}>
            Leave every day unselected for a one-time alarm.
          </Text>

          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const selected = repeatDays.includes(day.value);

              return (
                <Pressable
                  key={day.name}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={day.name}
                  onPress={() => toggleDay(day.value)}
                  style={[
                    styles.dayButton,
                    selected && styles.dayButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected && styles.dayTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Vibration</Text>
            <Text style={styles.settingSubtitle}>
              Vibrate when the alarm rings
            </Text>
          </View>

          <Switch
            value={vibration}
            onValueChange={setVibration}
            trackColor={{
              false: colors.border,
              true: colors.primaryDark,
            }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            Alarm setup preview
          </Text>
          <Text style={styles.noticeText}>
            {label.trim() || "Wake up"} · {formatTime(alarmTime)}
            {"\n"}
            {repeatDays.length
              ? `Repeats on ${repeatDays
                  .map((day) => DAYS[day].name)
                  .join(", ")}`
              : "One-time alarm"}
          </Text>
        </View>

        
<Pressable
  style={styles.saveButton}
  onPress={handleSaveAlarm}
>
  <Text style={styles.saveButtonText}>Save alarm</Text>
  <Text style={styles.saveArrow}>→</Text>
</Pressable>

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
    paddingTop: 55,
    paddingBottom: 40,
  },
  back: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 25,
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
    letterSpacing: 1.6,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "800",
    marginTop: 12,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  timeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
    marginTop: 25,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  timeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  timeText: {
    color: colors.text,
    fontSize: 37,
    fontWeight: "800",
  },
  editText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  input: {
    marginTop: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
    gap: 7,
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 43,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    color: colors.textSecondary,
    fontWeight: "700",
  },
  dayTextActive: {
    color: colors.background,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  settingSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },
  notice: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 15,
    marginTop: 22,
  },
  noticeTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  noticeText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
  saveArrow: {
    color: colors.background,
    fontSize: 22,
  },
  pickerPlaceholder: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
  },
  pickerHelp: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  pickerNote: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },
});
