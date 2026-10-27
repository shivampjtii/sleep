import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import {
  colors,
  radius,
  spacing,
} from "../constants/colors";

const FEATURES = [
  {
    icon: "∞",
    title: "Multiple alarms",
    description: "Create more wake-up alarms for your routine.",
  },
  {
    icon: "↻",
    title: "Recurring alarms",
    description: "Set alarms for specific days of the week.",
  },
  {
    icon: "◈",
    title: "More flexibility",
    description: "Manage your morning schedule with fewer limits.",
  },
  {
    icon: "☾",
    title: "Distraction-free experience",
    description: "Prepare for an ad-free experience as Premium develops.",
  },
];

export default function PremiumScreen() {
  const router = useRouter();

  function handleSubscribe() {
    Alert.alert(
      "Coming soon",
      "Premium purchases are not available yet. Google Play Billing will be integrated in a later development step.",
    );
  }

  function handleRestore() {
    Alert.alert(
      "Restore purchases",
      "Purchase restoration will be available after Google Play Billing is integrated.",
    );
  }

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
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>‹  Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.crownCircle}>
            <Text style={styles.crown}>♛</Text>
          </View>

          <Text style={styles.eyebrow}>SLEEPWISE PREMIUM</Text>

          <Text style={styles.title}>
            Make your mornings{"\n"}
            <Text style={styles.titleAccent}>your own.</Text>
          </Text>

          <Text style={styles.subtitle}>
            Get more flexibility to build a consistent
            sleep and wake-up routine.
          </Text>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>
            Your Premium benefits
          </Text>

          {FEATURES.map((feature, index) => (
            <View key={feature.title}>
              {index > 0 && <View style={styles.separator} />}

              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>
                    {feature.icon}
                  </Text>
                </View>

                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>

                <Text style={styles.check}>✓</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planTitle}>
                Premium membership
              </Text>
              <Text style={styles.planSubtitle}>
                Unlock additional app features
              </Text>
            </View>

            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>
                SOON
              </Text>
            </View>
          </View>

          <View style={styles.priceArea}>
            <Text style={styles.priceLabel}>
              Subscription pricing
            </Text>
            <Text style={styles.price}>
              Coming soon
            </Text>
            <Text style={styles.priceNote}>
              Final price and billing period will be shown
              when purchases become available.
            </Text>
          </View>

          <Pressable
            onPress={handleSubscribe}
            style={({ pressed }) => [
              styles.subscribeButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.subscribeText}>
              Explore Premium
            </Text>
            <Text style={styles.subscribeArrow}>→</Text>
          </Pressable>

          <Text style={styles.billingNote}>
            Purchasing is not available yet. No payment
            will be taken by this screen.
          </Text>
        </View>

        <Pressable
          onPress={handleRestore}
          style={styles.restoreButton}
          accessibilityRole="button"
        >
          <Text style={styles.restoreText}>
            Restore purchases
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          SleepWise helps you plan your sleep routine.
          Premium features and subscriptions are still
          under development.
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
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 22,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  crownCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  crown: {
    fontSize: 38,
    color: colors.primary,
  },
  eyebrow: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 40,
    marginTop: 14,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 300,
  },
  featuresCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconText: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: "700",
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  featureDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  check: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "800",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: 20,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  planTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  planSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },
  comingSoonBadge: {
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  comingSoonText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  priceArea: {
    marginTop: 24,
    marginBottom: 20,
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  price: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    marginTop: 7,
  },
  priceNote: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 54,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subscribeText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
  subscribeArrow: {
    color: colors.background,
    fontSize: 22,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  billingNote: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
  },
  restoreButton: {
    alignSelf: "center",
    padding: 16,
    marginTop: 4,
  },
  restoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 8,
  },
});
