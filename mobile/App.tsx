import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LocationCoords, RideCategory } from "./src/types";
import { useCompare } from "./src/hooks/useCompare";
import LocationInput from "./src/components/LocationInput";
import ScheduleSection from "./src/components/ScheduleSection";
import PromoCode from "./src/components/PromoCode";
import CompareButton from "./src/components/CompareButton";
import ErrorMessage from "./src/components/ErrorMessage";
import ResultsList from "./src/components/ResultsList";
import Disclaimer from "./src/components/Disclaimer";

export default function App() {
  const [pickup, setPickup] = useState<LocationCoords | null>(null);
  const [dropoff, setDropoff] = useState<LocationCoords | null>(null);
  const { results, loading, error, compare } = useCompare();

  const handleCompare = () => {
    if (!pickup || !dropoff) return;
    compare({
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      drop_lat: dropoff.lat,
      drop_lng: dropoff.lng,
      category: "Standard" as RideCategory,
    });
  };

  const canCompare = pickup !== null && dropoff !== null && !loading;

  const handleSwapLocations = () => {
    const tempPickup = pickup;
    const tempDropoff = dropoff;
    setPickup(tempDropoff);
    setDropoff(tempPickup);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Premium Ride Comparison</Text>
            </View>
            <Text style={styles.title}>RideCompare</Text>
            <Text style={styles.subtitle}>
              Compare prices from Uber and Lyft • Find the best deals instantly
            </Text>
          </View>

          {/* Schedule for Later */}
          <ScheduleSection />

          {/* Location Inputs */}
          <View style={styles.locationCard}>
            <View style={styles.pickupInputWrapper}>
              <LocationInput
                label="PICKUP LOCATION"
                onSelect={setPickup}
                placeholder="Enter pickup location"
              />
            </View>

            {/* Swap Button */}
            <View style={styles.swapContainer}>
              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapLocations}
                activeOpacity={0.7}
              >
                <Text style={styles.swapIcon}>→</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dropoffInputWrapper}>
              <LocationInput
                label="DROPOFF LOCATION"
                onSelect={setDropoff}
                placeholder="Enter dropoff location"
              />
            </View>

            {/* Additional Stops */}
            <View style={styles.divider} />
            <View style={styles.stopsRow}>
              <View>
                <Text style={styles.stopsTitle}>Additional Stops</Text>
                <Text style={styles.stopsSubtitle}>
                  Add stops along your route
                </Text>
              </View>
              <TouchableOpacity style={styles.addStopButton} activeOpacity={0.7}>
                <Text style={styles.addStopText}>+ Add Stop</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.noStopsText}>
              No additional stops added yet
            </Text>
          </View>

          {/* Promo Code */}
          <PromoCode />

          {/* Refresh Prices Button */}
          <CompareButton
            onPress={handleCompare}
            loading={loading}
            disabled={!canCompare}
          />

          {/* Error */}
          <ErrorMessage message={error} />

          {/* Results */}
          {results.length > 0 && (
            <View style={styles.resultsSection}>
              <ResultsList results={results} />
            </View>
          )}

          {/* Disclaimer */}
          {results.length > 0 && <Disclaimer />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
    paddingTop: 12,
  },
  badge: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#A78BFA",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  locationCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 20,
    marginBottom: 16,
  },
  pickupInputWrapper: {
    marginBottom: 8,
    zIndex: 20,
  },
  swapContainer: {
    alignItems: "center",
    marginVertical: 4,
    zIndex: 5,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  swapIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  dropoffInputWrapper: {
    marginBottom: 16,
    zIndex: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginBottom: 16,
  },
  stopsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stopsSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  addStopButton: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addStopText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A78BFA",
  },
  noStopsText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 8,
  },
  resultsSection: {
    marginTop: 8,
  },
});
