import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SUGGESTED_CODES = ["SAVE10", "RIDE20", "FIRST15"];

export default function PromoCode() {
  const [code, setCode] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promo Code</Text>

      <View style={styles.inputRow}>
        <Text style={styles.tagIcon}>🏷️</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Enter promo code"
          placeholderTextColor="#64748B"
        />
        <TouchableOpacity style={styles.applyButton} activeOpacity={0.7}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestedRow}>
        <Text style={styles.tryText}>Try:</Text>
        {SUGGESTED_CODES.map((c) => (
          <TouchableOpacity
            key={c}
            style={styles.codeChip}
            onPress={() => setCode(c)}
            activeOpacity={0.7}
          >
            <Text style={styles.codeChipText}>{c}</Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    paddingLeft: 12,
    marginBottom: 12,
  },
  tagIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    paddingVertical: 14,
  },
  applyButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 4,
  },
  applyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  suggestedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tryText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  codeChip: {
    backgroundColor: "#334155",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  codeChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#CBD5E1",
  },
});
