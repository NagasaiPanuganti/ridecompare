import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EstimateResult } from "../types";

interface ResultsCardProps {
  estimate: EstimateResult;
  isBestDeal: boolean;
}

export default function ResultsCard({ estimate, isBestDeal }: ResultsCardProps) {
  const isUber = estimate.provider === "Uber";
  const providerColor = isUber ? "#FFFFFF" : "#FF00BF";

  const handlePress = () => {
    if (estimate.redirect_url) {
      Linking.openURL(estimate.redirect_url).catch(() => {});
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isBestDeal && styles.cardBest]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={styles.providerInfo}>
          <Text style={[styles.providerName, { color: providerColor }]}>
            {estimate.provider}
          </Text>
          <View style={styles.etaRow}>
            <Text style={styles.clockIcon}>🕐</Text>
            <Text style={styles.etaText}>{estimate.eta_minutes} min</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ${estimate.estimated_price.toFixed(2)}
          </Text>
          {isBestDeal && (
            <View style={styles.bestDealBadge}>
              <Text style={styles.bestDealText}>Best Deal</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  cardBest: {
    borderColor: "#22C55E",
    backgroundColor: "rgba(34, 197, 94, 0.05)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "700",
  },
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clockIcon: {
    fontSize: 12,
  },
  etaText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bestDealBadge: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bestDealText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
