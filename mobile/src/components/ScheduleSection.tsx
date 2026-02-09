import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ScheduleSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule for Later</Text>
      <Text style={styles.subtitle}>Plan your ride in advance</Text>

      <View style={styles.row}>
        {/* Date Picker */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>📅  Date</Text>
          <View style={styles.picker}>
            <Text style={styles.pickerValue}>Today</Text>
            <Text style={styles.pickerArrow}>▾</Text>
          </View>
        </View>

        {/* Time Picker */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>🕐  Time</Text>
          <View style={styles.picker}>
            <Text style={styles.pickerValue}>Now</Text>
            <Text style={styles.pickerArrow}>▾</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#CBD5E1",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  pickerArrow: {
    fontSize: 12,
    color: "#94A3B8",
  },
});
