import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EstimateResult } from "../types";
import ResultsCard from "./ResultsCard";

interface ResultsListProps {
  results: EstimateResult[];
}

const CATEGORY_META: Record<
  string,
  { icon: string; description: string; co2: string }
> = {
  Standard: {
    icon: "🚗",
    description: "Affordable rides for everyday trips",
    co2: "2.5 kg CO\u2082 per trip",
  },
  XL: {
    icon: "👥",
    description: "Extra space for up to 6 passengers",
    co2: "3.2 kg CO\u2082 per trip",
  },
  Premium: {
    icon: "⚡",
    description: "High-end vehicles with top-rated drivers",
    co2: "2.8 kg CO\u2082 per trip",
  },
};

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) return null;

  // Group results by category
  const grouped: Record<string, EstimateResult[]> = {};
  results.forEach((est) => {
    const cat = est.normalized_category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(est);
  });

  // Find cheapest in each group
  const findCheapest = (items: EstimateResult[]): string => {
    const sorted = [...items].sort(
      (a, b) => a.estimated_price - b.estimated_price
    );
    return `${sorted[0].provider}-${sorted[0].normalized_category}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Available Rides</Text>
        <Text style={styles.updated}>Updated just now</Text>
      </View>

      {Object.entries(grouped).map(([category, estimates]) => {
        const meta = CATEGORY_META[category] || CATEGORY_META.Standard;
        const cheapestKey = findCheapest(estimates);
        const priceDiff =
          estimates.length > 1
            ? Math.abs(
                estimates[0].estimated_price - estimates[1].estimated_price
              )
            : 0;

        return (
          <View key={category} style={styles.categoryCard}>
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={styles.categoryLeft}>
                <View style={styles.iconBox}>
                  <Text style={styles.categoryIcon}>{meta.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryDesc}>{meta.description}</Text>
                  <Text style={styles.co2Text}>{meta.co2}</Text>
                </View>
              </View>
              {priceDiff > 0 && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>
                    ↘ Save ${priceDiff.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>

            {/* Provider rows */}
            {estimates.map((est) => (
              <ResultsCard
                key={`${est.provider}-${est.normalized_category}`}
                estimate={est}
                isBestDeal={
                  `${est.provider}-${est.normalized_category}` === cheapestKey
                }
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  updated: {
    fontSize: 13,
    color: "#64748B",
  },
  categoryCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 20,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    fontSize: 22,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  categoryDesc: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  co2Text: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  saveBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saveText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4ADE80",
  },
});
