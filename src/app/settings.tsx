
import React, { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants/config";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { colors, radius, spacing } from "../constants/colors";

const TIME_FORMAT_KEY = "sleepwise_settings_time_format";
const VIBRATION_KEY = "sleepwise_settings_vibration";

type TimeFormat = "12h" | "24h";

export default function SettingsScreen() {
  const router = useRouter();

  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12h");
  const [vibration, setVibration] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const [savedTimeFormat, savedVibration] = await Promise.all([
          AsyncStorage.getItem(TIME_FORMAT_KEY),
          AsyncStorage.getItem(VIBRATION_KEY),
        ]);

        if (!mounted) return;

        if (savedTimeFormat === "12h" || savedTimeFormat === "24h") {
          setTimeFormat(savedTimeFormat);
        }

        if (savedVibration !== null) {
          setVibration(savedVibration === "true");
        }
      } catch {
        Alert.alert(
          "Settings unavailable",
          "Some preferences could not be loaded. Default settings are being used.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  async function changeTimeFormat(value: TimeFormat) {
    const previous = timeFormat;
    setTimeFormat(value);

    try {
      await AsyncStorage.setItem(TIME_FORMAT_KEY, value);
    } catch {
      setTimeFormat(previous);
      Alert.alert("Unable to save", "Your time format preference was not saved.");
    }
  }

  async function changeVibration(value: boolean) {
    const previous = vibration;
    setVibration(value);

    try {
      await AsyncStorage.setItem(VIBRATION_KEY, String(value));
    } catch {
      setVibration(previous);
      Alert.alert("Unable to save", "Your vibration preference was not saved.");
    }
  }

  function showNotConfigured(feature: string) {
    Alert.alert(
      "Coming soon",
      `${feature} will be available in a future SleepWise update.`,
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>PERSONALIZE YOUR EXPERIENCE</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Make SleepWise work better for your routine.
        </Text>

        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.card}>
          <Text style={styles.rowTitle}>Time format</Text>
          <Text style={styles.rowDescription}>
            Choose how times are displayed.
          </Text>

          <View style={styles.segmentRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: timeFormat === "12h" }}
              disabled={loading}
              onPress={() => void changeTimeFormat("12h")}
              style={[
                styles.segment,
                timeFormat === "12h" && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  timeFormat === "12h" && styles.segmentTextActive,
                ]}
              >
                12-hour (AM/PM)
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: timeFormat === "24h" }}
              disabled={loading}
              onPress={() => void changeTimeFormat("24h")}
              style={[
                styles.segment,
                timeFormat === "24h" && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  timeFormat === "24h" && styles.segmentTextActive,
                ]}
              >
                24-hour
              </Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.rowTitle}>Vibration preference</Text>
              <Text style={styles.rowDescription}>
                Save your preferred vibration setting.
              </Text>
            </View>

            <Switch
              value={vibration}
              onValueChange={(value) => void changeVibration(value)}
              disabled={loading}
              trackColor={{
                false: colors.border,
                true: colors.primaryDark,
              }}
              thumbColor={colors.white}
            />
          </View>

          <Text style={styles.helperText}>
            These preferences are saved on this device. Applying the time
            format throughout every screen will be connected in a later step.
            Vibration does not trigger an alarm yet.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your SleepWise</Text>

        <Pressable
          style={styles.linkCard}
          onPress={() => router.push("/premium")}
          accessibilityRole="button"
        >
          <View style={styles.linkIcon}>
            <Text style={styles.linkIconText}>♛</Text>
          </View>
          <View style={styles.linkCopy}>
            <Text style={styles.rowTitle}>SleepWise Premium</Text>
            <Text style={styles.rowDescription}>
              Explore additional features.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable
          style={styles.linkCard}
          onPress={() => showNotConfigured("Privacy policy")}
          accessibilityRole="button"
        >
          <View style={styles.linkIcon}>
            <Text style={styles.linkIconText}>◇</Text>
          </View>
          <View style={styles.linkCopy}>
            <Text style={styles.rowTitle}>Privacy policy</Text>
            <Text style={styles.rowDescription}>
              Learn how your information is handled.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable
          style={styles.linkCard}
          onPress={() => showNotConfigured("Terms of use")}
          accessibilityRole="button"
        >
          <View style={styles.linkIcon}>
            <Text style={styles.linkIconText}>≡</Text>
          </View>
          <View style={styles.linkCopy}>
            <Text style={styles.rowTitle}>Terms of use</Text>
            <Text style={styles.rowDescription}>
              Review the app's terms.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>SleepWise</Text>
          <Text style={styles.aboutText}>
            A simple way to plan your bedtime and build a better morning
            routine.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <Text style={styles.footer}>
          Rest well. Wake up ready.
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
  eyebrow: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 26,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: 22,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  rowDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  segment: {
    flex: 1,
    minHeight: 43,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  segmentTextActive: {
    color: colors.background,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  switchCopy: {
    flex: 1,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 16,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: spacing.md,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  linkIconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "700",
  },
  linkCopy: {
    flex: 1,
  },
  chevron: {
    color: colors.primary,
    fontSize: 26,
  },
  aboutCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 18,
  },
  aboutTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  aboutText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  version: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 14,
  },
  footer: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    marginTop: 22,
  },
});
