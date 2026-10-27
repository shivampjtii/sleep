import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { colors, spacing } from "../constants/colors";

export default function CalculatorScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Sleep calculator</Text>
      <Text style={styles.description}>
        Choose your wake-up time and find bedtime recommendations.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Open calculator</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "700",
  },
});