import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CompareButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function CompareButton({
  onPress,
  loading,
  disabled,
}: CompareButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.content}>
          <Text style={styles.refreshIcon}>🔄</Text>
          <Text style={styles.buttonText}>Refresh Prices</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    marginBottom: 16,
    // Purple gradient effect (solid fallback - RN doesn't support gradients natively)
    backgroundColor: "#7C3AED",
  },
  buttonDisabled: {
    backgroundColor: "#4C1D95",
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshIcon: {
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
