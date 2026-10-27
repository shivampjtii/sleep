import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { colors, spacing } from "../../constants/colors";

export default function AlarmDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Alarm details</Text>
      <Text style={styles.description}>Alarm {id}</Text>
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