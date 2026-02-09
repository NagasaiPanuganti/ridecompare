import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Disclaimer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Prices are estimates and may vary based on demand and traffic.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
