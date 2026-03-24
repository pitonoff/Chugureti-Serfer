import { memo } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { GAME_CONFIG } from "../config/gameConfig";

type PlayerAvatarProps = {
  runCycle: Animated.Value;
};

export const PlayerAvatar = memo(function PlayerAvatar({
  runCycle,
}: PlayerAvatarProps) {
  const armFrontStyle = {
    transform: [
      {
        rotate: runCycle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["26deg", "-20deg", "26deg"],
        }),
      },
    ],
  };

  const armBackStyle = {
    transform: [
      {
        rotate: runCycle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["-22deg", "20deg", "-22deg"],
        }),
      },
    ],
  };

  const legFrontStyle = {
    transform: [
      {
        rotate: runCycle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["18deg", "-18deg", "18deg"],
        }),
      },
    ],
  };

  const legBackStyle = {
    transform: [
      {
        rotate: runCycle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["-16deg", "16deg", "-16deg"],
        }),
      },
    ],
  };

  const torsoStyle = {
    transform: [
      {
        rotate: runCycle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["-3deg", "2deg", "-3deg"],
        }),
      },
    ],
  };

  const shadowStyle = {
    transform: [
      {
        scaleX: runCycle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.86, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.character}>
        <Animated.View style={[styles.arm, styles.armBack, armBackStyle]} />
        <Animated.View style={[styles.leg, styles.legBack, legBackStyle]} />

        <Animated.View style={[styles.torsoGroup, torsoStyle]}>
          <View style={styles.head} />
          <View style={styles.torso}>
            <View style={styles.shirtStripe} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.arm, styles.armFront, armFrontStyle]} />
        <Animated.View style={[styles.leg, styles.legFront, legFrontStyle]} />
      </View>

      <Animated.View style={[styles.shadow, shadowStyle]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  character: {
    width: GAME_CONFIG.playerWidth + 26,
    height: GAME_CONFIG.playerHeight + 18,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  torsoGroup: {
    alignItems: "center",
    zIndex: 3,
  },
  head: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#ffd8b8",
    borderWidth: 2,
    borderColor: "#fff1de",
    marginBottom: 4,
  },
  torso: {
    width: 34,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1d7c62",
    borderWidth: 3,
    borderColor: "#d7fff4",
    overflow: "hidden",
    alignItems: "center",
  },
  shirtStripe: {
    width: 10,
    height: "100%",
    backgroundColor: "#7be0cb",
    opacity: 0.7,
  },
  arm: {
    position: "absolute",
    top: 30,
    width: 10,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#ffd8b8",
    borderWidth: 2,
    borderColor: "#fff1de",
    zIndex: 2,
  },
  armBack: {
    left: 18,
  },
  armFront: {
    right: 18,
  },
  leg: {
    position: "absolute",
    top: 66,
    width: 12,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#243447",
    zIndex: 1,
  },
  legBack: {
    left: 28,
  },
  legFront: {
    right: 28,
  },
  shadow: {
    marginTop: 4,
    width: 52,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.16)",
  },
});
