
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import {
  formatSleepWiseTime,
  useTimeFormat,
} from "../features/settings/timeFormat";

import { colors, radius, spacing } from "../constants/colors";
import {
  calculateBedtimes,
  formatDuration,
  formatTime,
} from "../features/sleep/sleepCalculator";

export default function HomeScreen() {
  const router = useRouter();
  const timeFormat = useTimeFormat();

  const [wakeUpTime, setWakeUpTime] = useState(() => {
    const date = new Date();
    date.setHours(6, 30, 0, 0);
    return date;
  });

  const [showPicker, setShowPicker] = useState(false);
  const [sleepOnsetMinutes, setSleepOnsetMinutes] =
    useState(15);

  const recommendations = useMemo(
    () =>
      calculateBedtimes(
        wakeUpTime,
        sleepOnsetMinutes,
      ),
    [wakeUpTime, sleepOnsetMinutes],
  );

  function handleTimeChange(
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setWakeUpTime((previous) => {
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              YOUR PERSONAL SLEEP GUIDE
            </Text>
            <Text style={styles.brand}>
              sleepwise<Text style={styles.brandDot}>.</Text>
            </Text>
          </View>

          <View style={styles.moonBadge}>
            <Text style={styles.moon}>☾</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>
            PLAN YOUR PERFECT NIGHT
          </Text>

          <Text style={styles.heroTitle}>
            Better sleep.
            {"\n"}
            <Text style={styles.heroAccent}>
              Brighter mornings.
            </Text>
          </Text>

          <Text style={styles.heroDescription}>
            Tell us when you want to wake up.
            {"\n"}
            We’ll help you plan when to go to bed.
          </Text>
        </View>

        <View style={styles.wakeCard}>
          <View style={styles.cardHeading}>
            <View>
              <Text style={styles.cardLabel}>
                I WANT TO WAKE UP AT
              </Text>
              <Text style={styles.smallMuted}>
                Choose your morning time
              </Text>
            </View>

            <Text style={styles.sunIcon}>☀</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Wake-up time ${formatSleepWiseTime(wakeUpTime, timeFormat)}. Change time`}
            onPress={() => setShowPicker(true)}
            style={({ pressed }) => [
              styles.timeButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.wakeTime}>
              {formatSleepWiseTime(wakeUpTime, timeFormat)}
            </Text>
            <Text style={styles.changeTime}>
              CHANGE TIME  ↗
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={wakeUpTime}
              mode="time"
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "clock"
              }
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.divider} />

          <Text style={styles.cardLabel}>
            TIME TO FALL ASLEEP
          </Text>

          <View style={styles.durationOptions}>
            {[0, 15, 30].map((minutes) => {
              const active =
                sleepOnsetMinutes === minutes;

              return (
                <Pressable
                  key={minutes}
                  onPress={() =>
                    setSleepOnsetMinutes(minutes)
                  }
                  style={[
                    styles.durationOption,
                    active && styles.durationOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.durationText,
                      active && styles.durationTextActive,
                    ]}
                  >
                    {minutes} min
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <View style={styles.resultsTitleGroup}>
            <Text style={styles.sectionTitle}>
              Your ideal bedtimes
            </Text>
            <Text style={styles.smallMuted}>
              Pick a time that works for you
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.resultsList}>
          {recommendations.map((item) => {
            const recommended =
              item.sleepHours === 8;

            return (
              <View
                key={item.id}
                style={[
                  styles.resultCard,
                  recommended &&
                    styles.resultCardRecommended,
                ]}
              >
                <View
                  style={[
                    styles.resultMoon,
                    recommended &&
                      styles.resultMoonRecommended,
                  ]}
                >
                  <Text style={styles.resultMoonText}>
                    {recommended ? "☾" : "✦"}
                  </Text>
                </View>

                <View style={styles.resultInfo}>
                  <Text style={styles.resultTime}>
                    {formatSleepWiseTime(item.bedtime, timeFormat)}
                  </Text>

                  <Text style={styles.resultDuration}>
                    {formatDuration(item.sleepHours)}
                    {sleepOnsetMinutes > 0
                      ? ` · ${sleepOnsetMinutes} min to fall asleep`
                      : ""}
                  </Text>
                </View>

                {recommended ? (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>
                      IDEAL
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.arrow}>›</Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>✧</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              A little sleep wisdom
            </Text>
            <Text style={styles.tipDescription}>
              Consistent bedtimes and wake-up times can
              help support a healthy sleep routine.
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            router.push({
              pathname: "/results",
              params: {
                wake: wakeUpTime.toISOString(),
                onset: String(sleepOnsetMinutes),
              },
            });
          }}
        >
          <Text style={styles.primaryButtonText}>
            Explore sleep plan
          </Text>
          <Text style={styles.primaryButtonArrow}>
            →
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          YOUR REST. YOUR ROUTINE. YOUR WAY.
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
    paddingHorizontal: spacing.lg,
    paddingTop: 58,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "600",
  },
  brand: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -1.2,
    marginTop: 4,
  },
  brandDot: {
    color: colors.primary,
  },
  moonBadge: {
    height: 48,
    width: 48,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  moon: {
    fontSize: 31,
    color: colors.primary,
  },
  hero: {
    marginBottom: 27,
  },
  heroEyebrow: {
    color: colors.secondary,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 35,
    lineHeight: 43,
    letterSpacing: -1.2,
    fontWeight: "800",
    color: colors.text,
  },
  heroAccent: {
    color: colors.primary,
  },
  heroDescription: {
    marginTop: 13,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  wakeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  smallMuted: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  sunIcon: {
    color: colors.secondary,
    fontSize: 24,
  },
  timeButton: {
    marginTop: 18,
    paddingVertical: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wakeTime: {
    color: colors.text,
    fontSize: 39,
    fontWeight: "700",
    letterSpacing: -1.5,
  },
  changeTime: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 21,
  },
  durationOptions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 13,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  durationOptionActive: {
    backgroundColor: "#292647",
    borderColor: colors.primary,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  durationTextActive: {
    color: colors.text,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 17,
  },
  resultsTitleGroup: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#172A31",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  liveText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  resultsList: {
    gap: 10,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  resultCardRecommended: {
    borderColor: colors.primary,
    backgroundColor: "#1D1B36",
  },
  resultMoon: {
    height: 44,
    width: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  resultMoonRecommended: {
    backgroundColor: "#38315E",
  },
  resultMoonText: {
    fontSize: 23,
    color: colors.primary,
  },
  resultInfo: {
    flex: 1,
  },
  resultTime: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  resultDuration: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 5,
  },
  recommendedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  recommendedText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  arrow: {
    color: colors.textSecondary,
    fontSize: 26,
  },
  tipCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#15262D",
    borderWidth: 1,
    borderColor: "#244047",
    borderRadius: 18,
    padding: 17,
    marginTop: 22,
  },
  tipIcon: {
    color: colors.secondary,
    fontSize: 25,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  tipDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5,
  },
  primaryButton: {
    marginTop: 22,
    backgroundColor: colors.primary,
    borderRadius: 17,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
  primaryButtonArrow: {
    color: colors.background,
    fontSize: 23,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.78,
  },
  footer: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 9,
    letterSpacing: 1.7,
    marginTop: 26,
  },
});
