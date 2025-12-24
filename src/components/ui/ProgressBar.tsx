import React from "react";
import { View, StyleSheet } from "react-native";

export function ProgressBar({ value, color = "#fb923c" }: { value: number; color?: string }) {
  return (
    <View style={styles.track}>
      <View 
        style={[
          styles.fill, 
          { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    borderRadius: 999,
    height: "100%",
  },
});