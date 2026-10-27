import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../constants/colors";

export default function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Sleep history</Text>
      <Text style={styles.description}>
        Your saved sleep plans will appear here.
      </Text>
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
});