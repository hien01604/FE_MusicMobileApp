import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  step: number;
  total: number;
};

export default function ProgressDots({ step, total }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const active = index + 1 === step;

        return (
          <View
            key={index}
            style={[styles.dot, active && styles.activeDot]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
  },

  activeDot: {
    backgroundColor: "#ff5c9d",
    width: 16,
  },
});