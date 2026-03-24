import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
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
          <View style={styles.poopShadow} />
          <View style={styles.poopBase} />
          <View style={styles.poopMiddle} />
          <View style={styles.poopTop} />
          <View style={styles.poopTip} />
        </>
      ) : null}
      {obstacle.type === "pit" ? (
        <Image
          source={require("../../assets/pit.png")}
          style={styles.pitSprite}
          resizeMode="contain"
        />
      ) : null}
      {obstacle.type === "car" ? (
        <Image
          source={require("../../assets/prius-top-cropped.png")}
          style={styles.carSprite}
          resizeMode="contain"
        />
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
  poopShadow: {
    position: "absolute",
    bottom: 0,
    width: 34,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(58, 34, 18, 0.22)",
  },
  poopBase: {
    position: "absolute",
    bottom: 3,
    width: 36,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#6f4528",
  },
  poopMiddle: {
    position: "absolute",
    bottom: 13,
    width: 28,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#835230",
  },
  poopTop: {
    position: "absolute",
    bottom: 21,
    width: 20,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#94603a",
  },
  poopTip: {
    position: "absolute",
    bottom: 29,
    width: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#a46d44",
  },
  pit: {
    backgroundColor: "transparent",
  },
  pitSprite: {
    width: "100%",
    height: "100%",
  },
  car: {
    backgroundColor: "transparent",
  },
  carSprite: {
    width: "100%",
    height: "104%",
  },
});
