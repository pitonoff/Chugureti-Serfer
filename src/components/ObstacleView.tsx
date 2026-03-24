import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Obstacle } from "../types/game";
import { getLaneLeftX } from "../utils/gameMath";

type ObstacleViewProps = {
  obstacle: Obstacle;
};

export const ObstacleView = memo(function ObstacleView({
  obstacle,
}: ObstacleViewProps) {
  return (
    <View
      style={[
        styles.base,
        {
          left: getLaneLeftX(obstacle.lane, obstacle.width),
          top: obstacle.y,
          width: obstacle.width,
          height: obstacle.height,
        },
        obstacle.type === "poop" && styles.poop,
        obstacle.type === "pit" && styles.pit,
        obstacle.type === "car" && styles.car,
      ]}
    >
      {obstacle.type === "poop" ? (
        <>
          <View style={styles.poopBase} />
          <View style={styles.poopMiddle} />
          <View style={styles.poopTop} />
          <View style={styles.poopTip} />
        </>
      ) : null}
      {obstacle.type === "pit" ? (
        <>
          <View style={styles.pitRim} />
          <View style={styles.pitInner} />
          <View style={styles.pitShadow} />
        </>
      ) : null}
      {obstacle.type === "car" ? (
        <>
          <View style={styles.priusBodyCore} />
          <View style={styles.priusNose} />
          <View style={styles.priusTail} />
          <View style={styles.priusBumperFront} />
          <View style={styles.priusBumperRear} />
          <View style={styles.priusShoulderLeft} />
          <View style={styles.priusShoulderRight} />
          <View style={styles.priusGlassShell} />
          <View style={styles.carWindshield} />
          <View style={styles.carCenterGlass} />
          <View style={styles.carRearWindow} />
          <View style={styles.priusRearGlassSplit} />
          <View style={styles.priusRoofArch} />
          <View style={styles.priusMirrorLeft} />
          <View style={styles.priusMirrorRight} />
          <View style={styles.priusBadge} />
          <View style={styles.priusPlate} />
          <View style={styles.priusHeadlightLeft} />
          <View style={styles.priusHeadlightRight} />
          <View style={styles.priusTaillightLeft} />
          <View style={styles.priusTaillightRight} />
          <View style={styles.dirtSmudgeTop} />
          <View style={styles.dirtSmudgeMiddle} />
          <View style={styles.dirtSmudgeBottom} />
          <View style={[styles.wheel, styles.wheelTopLeft]} />
          <View style={[styles.wheel, styles.wheelTopRight]} />
          <View style={[styles.wheel, styles.wheelBottomLeft]} />
          <View style={[styles.wheel, styles.wheelBottomRight]} />
        </>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  poop: {
    backgroundColor: "transparent",
  },
  poopBase: {
    position: "absolute",
    bottom: 2,
    width: 28,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#6f4528",
  },
  poopMiddle: {
    position: "absolute",
    bottom: 10,
    width: 22,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#835230",
  },
  poopTop: {
    position: "absolute",
    bottom: 16,
    width: 16,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#94603a",
  },
  poopTip: {
    position: "absolute",
    bottom: 21,
    width: 8,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#a46d44",
  },
  pit: {
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  pitRim: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#5b5f66",
  },
  pitShadow: {
    position: "absolute",
    bottom: 5,
    width: "68%",
    height: "22%",
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.22)",
  },
  pitInner: {
    width: "84%",
    height: "64%",
    borderRadius: 999,
    backgroundColor: "#121417",
    borderWidth: 1,
    borderColor: "#2b2f35",
  },
  car: {
    backgroundColor: "transparent",
  },
  priusBodyCore: {
    position: "absolute",
    top: 10,
    bottom: 10,
    width: "72%",
    borderRadius: 16,
    backgroundColor: "#ece8df",
    borderWidth: 3,
    borderColor: "#faf6ef",
  },
  wheel: {
    position: "absolute",
    width: 11,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#1e2125",
  },
  wheelTopLeft: {
    top: 16,
    left: -5,
  },
  wheelTopRight: {
    top: 16,
    right: -5,
  },
  wheelBottomLeft: {
    bottom: 16,
    left: -5,
  },
  wheelBottomRight: {
    bottom: 16,
    right: -5,
  },
  priusNose: {
    position: "absolute",
    top: 4,
    width: "54%",
    height: 26,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#f3f0e9",
  },
  priusTail: {
    position: "absolute",
    bottom: 4,
    width: "58%",
    height: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#e8e4db",
  },
  priusBumperFront: {
    position: "absolute",
    top: 10,
    width: "62%",
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ddd8ce",
  },
  priusBumperRear: {
    position: "absolute",
    bottom: 10,
    width: "64%",
    height: 7,
    borderRadius: 4,
    backgroundColor: "#d8d2c7",
  },
  priusShoulderLeft: {
    position: "absolute",
    top: 24,
    left: 7,
    width: 10,
    height: 82,
    borderRadius: 6,
    backgroundColor: "#f3efe8",
    transform: [{ rotate: "4deg" }],
  },
  priusShoulderRight: {
    position: "absolute",
    top: 24,
    right: 7,
    width: 10,
    height: 82,
    borderRadius: 6,
    backgroundColor: "#f3efe8",
    transform: [{ rotate: "-4deg" }],
  },
  priusGlassShell: {
    position: "absolute",
    top: 18,
    width: "50%",
    height: 88,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#d9e6eb",
  },
  carWindshield: {
    position: "absolute",
    top: 20,
    width: "42%",
    height: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: "#8faab3",
  },
  carCenterGlass: {
    position: "absolute",
    top: 44,
    width: "28%",
    height: 44,
    borderRadius: 8,
    backgroundColor: "#9db5bd",
  },
  carRearWindow: {
    position: "absolute",
    bottom: 20,
    width: "42%",
    height: 18,
    borderRadius: 8,
    backgroundColor: "#879ea7",
  },
  priusRearGlassSplit: {
    position: "absolute",
    bottom: 38,
    width: "36%",
    height: 3,
    borderRadius: 999,
    backgroundColor: "rgba(240, 245, 247, 0.85)",
  },
  priusRoofArch: {
    position: "absolute",
    top: 26,
    width: "46%",
    height: 64,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(250, 246, 239, 0.78)",
  },
  priusMirrorLeft: {
    position: "absolute",
    top: 46,
    left: 6,
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: "#d8d3ca",
  },
  priusMirrorRight: {
    position: "absolute",
    top: 46,
    right: 6,
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: "#d8d3ca",
  },
  priusBadge: {
    position: "absolute",
    top: 64,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#869ca5",
  },
  priusPlate: {
    position: "absolute",
    bottom: 18,
    width: 16,
    height: 8,
    borderRadius: 3,
    backgroundColor: "#f4efe7",
  },
  priusHeadlightLeft: {
    position: "absolute",
    top: 14,
    left: 6,
    width: 15,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f5e3a1",
    opacity: 0.9,
    transform: [{ rotate: "-18deg" }],
  },
  priusHeadlightRight: {
    position: "absolute",
    top: 14,
    right: 6,
    width: 15,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f5e3a1",
    opacity: 0.9,
    transform: [{ rotate: "18deg" }],
  },
  priusTaillightLeft: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 14,
    height: 9,
    borderRadius: 4,
    backgroundColor: "#cf615f",
    opacity: 0.9,
    transform: [{ rotate: "10deg" }],
  },
  priusTaillightRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 14,
    height: 9,
    borderRadius: 4,
    backgroundColor: "#cf615f",
    opacity: 0.9,
    transform: [{ rotate: "-10deg" }],
  },
  dirtSmudgeTop: {
    position: "absolute",
    top: 26,
    left: 8,
    width: 20,
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(138, 127, 105, 0.34)",
    transform: [{ rotate: "-14deg" }],
  },
  dirtSmudgeMiddle: {
    position: "absolute",
    top: 62,
    right: 8,
    width: 17,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(138, 127, 105, 0.28)",
    transform: [{ rotate: "11deg" }],
  },
  dirtSmudgeBottom: {
    position: "absolute",
    bottom: 24,
    left: 16,
    width: 24,
    height: 13,
    borderRadius: 999,
    backgroundColor: "rgba(138, 127, 105, 0.3)",
    transform: [{ rotate: "8deg" }],
  },
});
