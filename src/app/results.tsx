
import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ResultsScreen() {
  const router = useRouter();
  const timeFormat = useTimeFormat();
  const params = useLocalSearchParams<{
    wake?: string;
    onset?: string;
  }>();

  const wakeUpTime = useMemo(() => {
    const parsed = new Date(params.wake ?? "");

    if (Number.isNaN(parsed.getTime())) {
      const fallback = new Date();
      fallback.setHours(6, 30, 0, 0);
      return fallback;
    }

    return parsed;
  }, [params.wake]);

  const onset = Math.min(
    120,
    Math.max(0, Number(params.onset ?? 15) || 0),
  );

  const recommendations = useMemo(
    () => calculateBedtimes(wakeUpTime, onset),
    [wakeUpTime, onset],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹  Back to calculator</Text>
        </Pressable>

        <Text style={styles.eyebrow}>YOUR PERSONAL SLEEP PLAN</Text>
        <Text style={styles.title}>
          Make tonight{"\n"}
          <Text style={styles.accent}>count.</Text>
        </Text>

        <View style={styles.wakeCard}>
          <Text style={styles.mutedLabel}>YOUR WAKE-UP TIME</Text>
          <Text style={styles.wakeTime}>
            {formatSleepWiseTime(wakeUpTime, timeFormat)}
          </Text>
          <Text style={styles.wakeDescription}>
            Plan your bedtime around the morning you want.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Choose your bedtime
        </Text>
        <Text style={styles.subtitle}>
          Each option includes {onset} minutes to fall asleep.
        </Text>

        {recommendations.map((item) => {
          const isRecommended = item.sleepHours === 8;

          return (
            <View
              key={item.id}
              style={[
                styles.resultCard,
                isRecommended && styles.recommendedCard,
              ]}
            >
              <View style={styles.moonCircle}>
                <Text style={styles.moon}>
                  {isRecommended ? "☾" : "✦"}
                </Text>
              </View>

              <View style={styles.resultInfo}>
                <Text style={styles.bedtime}>
                  {formatSleepWiseTime(item.bedtime, timeFormat)}
                </Text>
                <Text style={styles.duration}>
                  {formatDuration(item.sleepHours)}
                </Text>
                {isRecommended && (
                  <Text style={styles.recommendedLabel}>
                    RECOMMENDED OPTION
                  </Text>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Choose bedtime ${formatSleepWiseTime(item.bedtime, timeFormat)}`}
                onPress={() => {
                  router.push({
                    pathname: "/alarms/create",
                    params: {
                      bedtime: item.bedtime.toISOString(),
                      wake: wakeUpTime.toISOString(),
                      sleepHours: String(item.sleepHours),
                    },
                  });
                }}
                style={styles.chooseButton}
              >
                <Text style={styles.chooseText}>Choose</Text>
              </Pressable>
            </View>
          );
        })}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>A helpful reminder</Text>
          <Text style={styles.tipText}>
            Sleep needs vary. These are planning estimates, not a
            guarantee of sleep quality or sleep-cycle timing.
            Keep your sleep and wake-up schedule consistent.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/alarms")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            View my alarms  →
          </Text>
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
    paddingTop: 58,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 28,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  eyebrow: {
    color: colors.secondary,
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1,
    marginTop: 12,
    marginBottom: 24,
  },
  accent: {
    color: colors.primary,
  },
  wakeCard: {
    padding: 22,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },
  mutedLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  wakeTime: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "800",
    marginTop: 10,
  },
  wakeDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 16,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    marginBottom: 10,
  },
  recommendedCard: {
    borderColor: colors.primary,
    backgroundColor: "#1D1B36",
  },
  moonCircle: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  moon: {
    color: colors.primary,
    fontSize: 22,
  },
  resultInfo: {
    flex: 1,
  },
  bedtime: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  duration: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  recommendedLabel: {
    color: colors.secondary,
    fontSize: 8,
    letterSpacing: 0.8,
    fontWeight: "800",
    marginTop: 6,
  },
  chooseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
  },
  chooseText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: "800",
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 18,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },
  secondaryButton: {
    marginTop: 18,
    padding: 17,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },
});
