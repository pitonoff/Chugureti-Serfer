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
        obstacle.type === "manhole" && styles.manhole,
        obstacle.type === "car" && styles.car,
      ]}
    >
      {obstacle.type === "poop" ? (
        <Image
          source={require("../../assets/kal-prepped.png")}
          style={styles.poopSprite}
          resizeMode="contain"
        />
      ) : null}
      {obstacle.type === "pit" ? (
        <Image
          source={require("../../assets/pit-new-prepped.png")}
          style={styles.pitSprite}
          resizeMode="contain"
        />
      ) : null}
      {obstacle.type === "manhole" ? (
        <Image
          source={require("../../assets/kolo-new-prepped.png")}
          style={styles.manholeSprite}
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
  poopSprite: {
    width: "106%",
    height: "106%",
  },
  pit: {
    backgroundColor: "transparent",
  },
  pitSprite: {
    width: "100%",
    height: "100%",
  },
  manhole: {
    backgroundColor: "transparent",
  },
  manholeSprite: {
    width: "104%",
    height: "104%",
  },
  car: {
    backgroundColor: "transparent",
  },
  carSprite: {
    width: "100%",
    height: "104%",
  },
});
