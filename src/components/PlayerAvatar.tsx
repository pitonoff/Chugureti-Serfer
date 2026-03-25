import { memo, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { GAME_CONFIG } from "../config/gameConfig";
import {
  PLAYER_FRAME_COUNT,
  PLAYER_FRAME_INTERVAL_MS,
  PLAYER_FRAME_SHEET_SOURCE,
} from "../config/playerFrames";

type PlayerAvatarProps = {
  isColliding?: boolean;
};

const CHARACTER_WIDTH = GAME_CONFIG.playerWidth + 34;
const CHARACTER_HEIGHT = GAME_CONFIG.playerHeight + 28;

export const PlayerAvatar = memo(function PlayerAvatar({
  isColliding = false,
}: PlayerAvatarProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((current) => (current + 1) % PLAYER_FRAME_COUNT);
    }, PLAYER_FRAME_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.character}>
        {isColliding ? (
          <Image
            source={require("../../assets/ui/col-transparent-web.png")}
            style={[styles.sprite, styles.collisionSprite]}
            resizeMode="contain"
            fadeDuration={0}
          />
        ) : (
          <View style={styles.viewport}>
            <Image
              source={PLAYER_FRAME_SHEET_SOURCE}
              style={[
                styles.spriteSheet,
                {
                  width: CHARACTER_WIDTH * PLAYER_FRAME_COUNT,
                  height: CHARACTER_HEIGHT,
                  transform: [{ translateX: -frameIndex * CHARACTER_WIDTH }],
                },
              ]}
              resizeMode="stretch"
              fadeDuration={0}
            />
          </View>
        )}
      </View>
      {!isColliding ? <View style={styles.shadow} /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  character: {
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewport: {
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
    overflow: "hidden",
  },
  sprite: {
    width: "100%",
    height: "100%",
  },
  spriteSheet: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  collisionSprite: {
    width: "146%",
    height: "146%",
  },
  shadow: {
    marginTop: -8,
    width: 58,
    height: 13,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
});
