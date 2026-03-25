import { memo, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { GAME_CONFIG } from "../config/gameConfig";
import {
  PLAYER_FRAME_INTERVAL_MS,
  PLAYER_FRAME_SOURCES,
} from "../config/playerFrames";
 
type PlayerAvatarProps = {
  isColliding?: boolean;
};

export const PlayerAvatar = memo(function PlayerAvatar({
  isColliding = false,
}: PlayerAvatarProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((current) => (current + 1) % PLAYER_FRAME_SOURCES.length);
    }, PLAYER_FRAME_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.character}>
        <Image
          source={
            isColliding
              ? require("../../assets/ui/col-transparent.png")
              : PLAYER_FRAME_SOURCES[frameIndex]
          }
          style={[styles.sprite, isColliding && styles.collisionSprite]}
          resizeMode="contain"
          fadeDuration={0}
        />
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
    width: GAME_CONFIG.playerWidth + 34,
    height: GAME_CONFIG.playerHeight + 28,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  sprite: {
    width: "100%",
    height: "100%",
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
