import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { BOMJ_FRAME_SOURCES } from "../config/bomjFrames";
import { GOP_FRAME_SOURCES } from "../config/gopFrames";
import { Obstacle } from "../types/game";
import { getLaneLeftX } from "../utils/gameMath";

type ObstacleViewProps = {
  obstacle: Obstacle;
  pitAnimationFrame: number;
  bomjAnimationFrame: number;
};

export const ObstacleView = memo(function ObstacleView({
  obstacle,
  pitAnimationFrame,
  bomjAnimationFrame,
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
        obstacle.type === "bomj" && styles.bomj,
        obstacle.type === "car" && styles.car,
      ]}
    >
      {obstacle.type === "poop" ? (
        <Image
          source={require("../../assets/kal-prepped-web.png")}
          style={styles.poopSprite}
          resizeMode="contain"
          fadeDuration={0}
        />
      ) : null}
      {obstacle.type === "pit" ? (
        <Image
          source={GOP_FRAME_SOURCES[pitAnimationFrame]}
          style={styles.pitSprite}
          resizeMode="contain"
          fadeDuration={0}
        />
      ) : null}
      {obstacle.type === "bomj" ? (
        <Image
          source={BOMJ_FRAME_SOURCES[bomjAnimationFrame]}
          style={styles.bomjSprite}
          resizeMode="contain"
          fadeDuration={0}
        />
      ) : null}
      {obstacle.type === "manhole" ? (
        <Image
          source={require("../../assets/kolo-new-prepped-web.png")}
          style={styles.manholeSprite}
          resizeMode="contain"
          fadeDuration={0}
        />
      ) : null}
      {obstacle.type === "car" ? (
        <Image
          source={require("../../assets/prius-top-cropped-web.png")}
          style={styles.carSprite}
          resizeMode="contain"
          fadeDuration={0}
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
  bomj: {
    backgroundColor: "transparent",
  },
  bomjSprite: {
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
