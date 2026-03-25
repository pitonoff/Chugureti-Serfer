import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  GAME_CONFIG,
  PLAYER_Y,
  ROAD_LAYOUT,
} from "../config/gameConfig";
import { BOMJ_FRAME_COUNT, BOMJ_FRAME_INTERVAL_MS } from "../config/bomjFrames";
import { GOP_FRAME_COUNT, GOP_FRAME_INTERVAL_MS } from "../config/gopFrames";
import { UI_THEME } from "../config/uiTheme";
import { useGameLoop } from "../hooks/useGameLoop";
import { getTelegramTopInset } from "../hooks/useTelegramMiniApp";
import { Obstacle } from "../types/game";
import {
  checkCollision,
  createObstacle,
  getGameSpeed,
  getLaneCenterX,
  getRandomObstacleType,
  getSpawnInterval,
} from "../utils/gameMath";
import { ObstacleView } from "./ObstacleView";
import { PlayerAvatar } from "./PlayerAvatar";

type GameScreenProps = {
  onGameOver: (score: number) => void;
};

export function GameScreen({ onGameOver }: GameScreenProps) {
  const collisionDelayMs = 320;
  const roadPatternHeight = 640;
  const telegramTopInset =
    Platform.OS === "web" ? getTelegramTopInset() : 0;
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [roadOffset, setRoadOffset] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isColliding, setIsColliding] = useState(false);

  const laneRef = useRef(1);
  const spawnTimerRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const gameOverTriggeredRef = useRef(false);
  const laneX = useRef(new Animated.Value(getLaneCenterX(1))).current;
  const runCycle = useRef(new Animated.Value(0)).current;
  const actionOffsetY = useRef(new Animated.Value(0)).current;
  const bodyScaleY = useRef(new Animated.Value(1)).current;
  const collisionFlashOpacity = useRef(new Animated.Value(0)).current;
  const collisionBurstScale = useRef(new Animated.Value(0.78)).current;
  const actionLockedRef = useRef(false);
  const scoreRef = useRef(0);
  const collisionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSpeed = getGameSpeed(elapsed);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(runCycle, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(runCycle, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [runCycle]);

  useEffect(() => {
    return () => {
      if (collisionTimeoutRef.current) {
        clearTimeout(collisionTimeoutRef.current);
      }
    };
  }, []);

  const moveToLane = useCallback((nextLane: number) => {
    const clampedLane = Math.max(0, Math.min(GAME_CONFIG.lanes - 1, nextLane));

    laneRef.current = clampedLane;

    Animated.spring(laneX, {
      toValue: getLaneCenterX(clampedLane),
      useNativeDriver: true,
      speed: 18,
      bounciness: 7,
    }).start();
  }, [laneX]);

  const moveLeft = useCallback(() => {
    moveToLane(laneRef.current - 1);
  }, [moveToLane]);

  const moveRight = useCallback(() => {
    moveToLane(laneRef.current + 1);
  }, [moveToLane]);

  const releaseActionLock = useCallback(() => {
    actionLockedRef.current = false;
  }, []);

  const performJump = useCallback(() => {
    if (actionLockedRef.current) {
      return;
    }

    actionLockedRef.current = true;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(actionOffsetY, {
          toValue: -38,
          duration: 130,
          useNativeDriver: true,
        }),
        Animated.timing(bodyScaleY, {
          toValue: 1.06,
          duration: 130,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(actionOffsetY, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(bodyScaleY, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
    ]).start(releaseActionLock);
  }, [actionOffsetY, bodyScaleY, releaseActionLock]);

  const performDuck = useCallback(() => {
    if (actionLockedRef.current) {
      return;
    }

    actionLockedRef.current = true;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(actionOffsetY, {
          toValue: 8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bodyScaleY, {
          toValue: 0.84,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(actionOffsetY, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(bodyScaleY, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]),
    ]).start(releaseActionLock);
  }, [actionOffsetY, bodyScaleY, releaseActionLock]);

  const endGame = useCallback(
    (finalScore: number) => {
      if (gameOverTriggeredRef.current) {
        return;
      }

      gameOverTriggeredRef.current = true;
      setIsRunning(false);
      setIsColliding(true);
      collisionFlashOpacity.setValue(0);
      collisionBurstScale.setValue(0.78);
      Animated.parallel([
        Animated.timing(collisionFlashOpacity, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.spring(collisionBurstScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 18,
          bounciness: 10,
        }),
      ]).start();
      collisionTimeoutRef.current = setTimeout(() => {
        onGameOver(finalScore);
      }, collisionDelayMs);
    },
    [collisionBurstScale, collisionFlashOpacity, onGameOver],
  );

  useGameLoop(
    isRunning,
    useCallback(
      (deltaSeconds, elapsedSeconds) => {
        const speed = getGameSpeed(elapsedSeconds);
        const nextScore = Math.floor(
          elapsedSeconds * GAME_CONFIG.scorePerSecond,
        );

        setElapsed(elapsedSeconds);
        setRoadOffset(
          (current) => (current + speed * deltaSeconds) % roadPatternHeight,
        );
        setScore(nextScore);
        scoreRef.current = nextScore;

        spawnTimerRef.current += deltaSeconds;

        setObstacles((current) => {
          let nextObstacles = current.map((obstacle) => ({
            ...obstacle,
            y: obstacle.y + speed * deltaSeconds,
          }));

          const spawnInterval = getSpawnInterval(elapsedSeconds);

          if (spawnTimerRef.current >= spawnInterval) {
            spawnTimerRef.current = 0;

            const type = getRandomObstacleType();
            const occupiedLanes = nextObstacles
              .filter((obstacle) => obstacle.y < 160)
              .map((obstacle) => obstacle.lane);
            const allLanes = Array.from(
              { length: GAME_CONFIG.lanes },
              (_, index) => index,
            );
            const freeLanes = allLanes.filter(
              (lane) => !occupiedLanes.includes(lane),
            );
            const lanePool = freeLanes.length > 0 ? freeLanes : allLanes;
            const lane =
              lanePool[Math.floor(Math.random() * lanePool.length)];

            nextObstacles = [
              ...nextObstacles,
              createObstacle(obstacleIdRef.current++, lane, type),
            ];
          }

          nextObstacles = nextObstacles.filter(
            (obstacle) =>
              obstacle.y <
              ROAD_LAYOUT.height + GAME_CONFIG.obstacleCleanupOffset,
          );

          if (
            checkCollision(
              laneRef.current,
              0,
              nextObstacles,
            )
          ) {
            requestAnimationFrame(() => {
              endGame(scoreRef.current);
            });
          }

          return nextObstacles;
        });
      },
      [endGame],
    ),
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
        onPanResponderRelease: (_, gestureState) => {
          const isHorizontalSwipe =
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy);

          if (isHorizontalSwipe) {
            if (gestureState.dx <= -GAME_CONFIG.swipeThreshold) {
              moveLeft();
            } else if (gestureState.dx >= GAME_CONFIG.swipeThreshold) {
              moveRight();
            }
          } else {
            if (gestureState.dy <= -GAME_CONFIG.swipeThreshold) {
              performJump();
            } else if (gestureState.dy >= GAME_CONFIG.swipeThreshold) {
              performDuck();
            }
          }
        },
        onPanResponderTerminate: () => undefined,
      }),
    [moveLeft, moveRight, performDuck, performJump],
  );

  const runnerAnimationStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: runCycle.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -8],
          }),
        },
        { translateY: actionOffsetY },
        {
          rotate: runCycle.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ["-2deg", "1deg", "-2deg"],
          }),
        },
        { scaleY: bodyScaleY },
      ],
    }),
    [actionOffsetY, bodyScaleY, runCycle],
  );

  const roadDecorations = useMemo(
    () => [
      { kind: "patch", top: 48, left: 34, width: 94, height: 14, rotate: "-2deg" },
      { kind: "crack", top: 102, left: 86, width: 2, height: 34, rotate: "-7deg" },
      { kind: "stone", top: 148, left: 164, width: 8, height: 7, rotate: "0deg" },
      { kind: "stone", top: 186, left: 108, width: 9, height: 8, rotate: "0deg" },
      { kind: "patch", top: 236, left: 144, width: 78, height: 12, rotate: "2deg" },
      { kind: "crack", top: 292, left: 176, width: 2, height: 22, rotate: "6deg" },
      { kind: "stone", top: 338, left: 54, width: 7, height: 6, rotate: "0deg" },
      { kind: "patch", top: 392, left: 82, width: 104, height: 15, rotate: "-1deg" },
      { kind: "stone", top: 446, left: 194, width: 9, height: 7, rotate: "0deg" },
      { kind: "crack", top: 506, left: 114, width: 2, height: 24, rotate: "-5deg" },
      { kind: "stone", top: 560, left: 68, width: 8, height: 7, rotate: "0deg" },
    ],
    [],
  );

  const sidewalkDetails = useMemo(
    () => [
      { side: "left", top: 112, type: "puddle" },
      { side: "left", top: 248, type: "can" },
      { side: "left", top: 404, type: "grass" },
      { side: "right", top: 146, type: "paper" },
      { side: "right", top: 296, type: "puddle" },
      { side: "right", top: 448, type: "grass" },
    ],
    [],
  );

  const sidewalkTiles = useMemo(
    () => Array.from({ length: 10 }, (_, index) => 38 + index * 64),
    [],
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.skyTop} />
      <View style={styles.skyMid} />
      <View style={styles.skyLow} />
      <View style={styles.sunGlow} />
      <View style={styles.atmosphereFade} />
      <View style={styles.cloudLeft} />
      <View style={styles.cloudRight} />
      <View style={styles.clothesline}>
        <View style={[styles.laundry, styles.laundryRust]} />
        <View style={[styles.laundry, styles.laundryCream]} />
        <View style={[styles.laundry, styles.laundryTeal]} />
      </View>
      <View style={styles.skyline}>
        <View style={[styles.building, styles.buildingShort]}>
          <View style={styles.balcony} />
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
        </View>
        <View style={[styles.building, styles.buildingTall]}>
          <View style={[styles.balcony, styles.balconyWide]} />
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
        </View>
        <View style={[styles.building, styles.buildingShortAlt]}>
          <View style={styles.awning} />
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
        </View>
      </View>

      <View style={styles.sidewalkLeft}>
        <View style={styles.curbLeft} />
        {sidewalkTiles.map((top) => (
          <View key={`left-${top}`} style={[styles.tileSeam, { top }]} />
        ))}
      </View>
      <View style={styles.sidewalkRight}>
        <View style={styles.curbRight} />
        {sidewalkTiles.map((top) => (
          <View key={`right-${top}`} style={[styles.tileSeam, { top }]} />
        ))}
      </View>

      {sidewalkDetails.map((detail, index) => {
        const isLeft = detail.side === "left";
        const sideBaseStyle = isLeft
          ? styles.sideDetailLeft
          : styles.sideDetailRight;

        return (
          <View
            key={`${detail.side}-${detail.type}-${index}`}
            style={[
              sideBaseStyle,
              { top: detail.top },
              detail.type === "puddle" && styles.sidePuddle,
              detail.type === "can" && styles.sideCan,
              detail.type === "paper" && styles.sidePaper,
              detail.type === "grass" && styles.sideGrass,
            ]}
          />
        );
      })}

      <View style={styles.road}>
        <View style={styles.roadTexture} />
        <View
          style={[
            styles.roadPatternLayer,
            { top: roadOffset - roadPatternHeight, height: roadPatternHeight },
          ]}
        >
          {roadDecorations.map((decoration, index) => (
            <View
              key={`pattern-a-${index}`}
              style={[
                decoration.kind === "patch" && styles.asphaltPatch,
                decoration.kind === "crack" && styles.roadCrack,
                decoration.kind === "stone" && styles.roadStone,
                {
                  top: decoration.top,
                  left: decoration.left,
                  width: decoration.width,
                  height: decoration.height,
                  transform: [{ rotate: decoration.rotate }],
                },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.roadPatternLayer,
            { top: roadOffset, height: roadPatternHeight },
          ]}
        >
          {roadDecorations.map((decoration, index) => (
            <View
              key={`pattern-b-${index}`}
              style={[
                decoration.kind === "patch" && styles.asphaltPatch,
                decoration.kind === "crack" && styles.roadCrack,
                decoration.kind === "stone" && styles.roadStone,
                {
                  top: decoration.top,
                  left: decoration.left,
                  width: decoration.width,
                  height: decoration.height,
                  transform: [{ rotate: decoration.rotate }],
                },
              ]}
            />
          ))}
        </View>
        {obstacles.map((obstacle) => (
          <ObstacleView
            key={obstacle.id}
            obstacle={obstacle}
            pitAnimationFrame={
              Math.floor((elapsed * 1000) / GOP_FRAME_INTERVAL_MS) %
              GOP_FRAME_COUNT
            }
            bomjAnimationFrame={
              Math.floor((elapsed * 1000) / BOMJ_FRAME_INTERVAL_MS) %
              BOMJ_FRAME_COUNT
            }
          />
        ))}
        <Animated.View
          style={[
            styles.player,
            {
              transform: [
                {
                  translateX: Animated.subtract(
                    laneX,
                    GAME_CONFIG.playerWidth / 2,
                  ),
                },
              ],
              top: PLAYER_Y,
            },
          ]}
        >
          <Animated.View
            style={[
              runnerAnimationStyle,
              isColliding && {
                transform: [
                  ...runnerAnimationStyle.transform,
                  { scale: collisionBurstScale },
                ],
              },
            ]}
          >
            <PlayerAvatar isColliding={isColliding} />
          </Animated.View>
        </Animated.View>
        {isColliding ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.collisionOverlay,
              { opacity: collisionFlashOpacity },
            ]}
          />
        ) : null}
      </View>

      <View
        style={[
          styles.hud,
          {
            top: 16 + telegramTopInset,
          },
        ]}
      >
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Очки</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Темп</Text>
            <Text style={styles.scoreValue}>{Math.round(currentSpeed)}</Text>
          </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1cda1",
    overflow: "hidden",
  },
  skyTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: "#f5b36a",
  },
  skyMid: {
    position: "absolute",
    top: 86,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "#efc189",
  },
  skyLow: {
    position: "absolute",
    top: 158,
    left: 0,
    right: 0,
    height: 88,
    backgroundColor: "#ead4b4",
  },
  sunGlow: {
    position: "absolute",
    top: 6,
    right: -12,
    width: 124,
    height: 124,
    borderRadius: 999,
    backgroundColor: "rgba(255, 232, 176, 0.72)",
  },
  atmosphereFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 210,
    backgroundColor: "rgba(255, 241, 219, 0.2)",
  },
  cloudLeft: {
    position: "absolute",
    top: 36,
    left: 28,
    width: 84,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255, 247, 234, 0.65)",
  },
  cloudRight: {
    position: "absolute",
    top: 74,
    right: 74,
    width: 58,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(255, 247, 234, 0.55)",
  },
  clothesline: {
    position: "absolute",
    top: 102,
    left: 28,
    right: 28,
    maxWidth: 340,
    alignSelf: "center",
    height: 2,
    backgroundColor: "rgba(117, 77, 49, 0.45)",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  laundry: {
    marginTop: 2,
    width: 18,
    height: 22,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  laundryRust: {
    backgroundColor: "#b55f46",
  },
  laundryCream: {
    backgroundColor: "#f0dfbe",
  },
  laundryTeal: {
    backgroundColor: "#5f8a84",
  },
  skyline: {
    position: "absolute",
    top: 42,
    left: 20,
    right: 20,
    maxWidth: 340,
    alignSelf: "center",
    height: 122,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  building: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#825f42",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(122, 74, 54, 0.18)",
  },
  buildingShort: {
    width: 70,
    height: 70,
    backgroundColor: "#ce7d63",
  },
  buildingTall: {
    width: 110,
    height: 116,
    backgroundColor: "#be644f",
  },
  buildingShortAlt: {
    width: 84,
    height: 78,
    backgroundColor: "#d8a06e",
  },
  balcony: {
    position: "absolute",
    top: 18,
    width: "62%",
    height: 8,
    borderRadius: 3,
    backgroundColor: "#6f4732",
  },
  balconyWide: {
    width: "72%",
  },
  awning: {
    position: "absolute",
    top: 18,
    width: "70%",
    height: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#6e8b8f",
  },
  windowRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  window: {
    width: 11,
    height: 14,
    borderRadius: 3,
    backgroundColor: "rgba(255, 233, 190, 0.86)",
  },
  sidewalkLeft: {
    position: "absolute",
    left: ROAD_LAYOUT.left - 24,
    top: ROAD_LAYOUT.top,
    width: 24,
    height: ROAD_LAYOUT.height,
    backgroundColor: "#cfb894",
  },
  sidewalkRight: {
    position: "absolute",
    left: ROAD_LAYOUT.left + GAME_CONFIG.roadWidth,
    top: ROAD_LAYOUT.top,
    width: 24,
    height: ROAD_LAYOUT.height,
    backgroundColor: "#cfb894",
  },
  curbLeft: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 6,
    bottom: 0,
    backgroundColor: "#b8aea3",
  },
  curbRight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 6,
    bottom: 0,
    backgroundColor: "#b8aea3",
  },
  tileSeam: {
    position: "absolute",
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: "rgba(180, 155, 128, 0.42)",
  },
  road: {
    position: "absolute",
    left: ROAD_LAYOUT.left,
    top: ROAD_LAYOUT.top,
    width: GAME_CONFIG.roadWidth,
    height: ROAD_LAYOUT.height,
    backgroundColor: "#45464a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  roadTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#434448",
  },
  roadPatternLayer: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  asphaltPatch: {
    position: "absolute",
    height: 14,
    borderRadius: 5,
    backgroundColor: "rgba(102, 105, 110, 0.5)",
  },
  roadCrack: {
    position: "absolute",
    width: 2,
    borderRadius: 999,
    backgroundColor: "rgba(20, 20, 22, 0.28)",
  },
  roadStone: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(90, 92, 96, 0.84)",
  },
  collisionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(162, 51, 44, 0.16)",
  },
  sideDetailLeft: {
    position: "absolute",
    left: ROAD_LAYOUT.left - 20,
  },
  sideDetailRight: {
    position: "absolute",
    left: ROAD_LAYOUT.left + GAME_CONFIG.roadWidth + 4,
  },
  sidePuddle: {
    width: 14,
    height: 26,
    borderRadius: 999,
    backgroundColor: "rgba(126, 149, 160, 0.5)",
    transform: [{ rotate: "14deg" }],
  },
  sideCan: {
    width: 9,
    height: 16,
    borderRadius: 3,
    backgroundColor: "#9ca3a9",
    borderWidth: 1,
    borderColor: "#ced4d8",
    transform: [{ rotate: "-12deg" }],
  },
  sidePaper: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#f2ede2",
    transform: [{ rotate: "18deg" }],
  },
  sideGrass: {
    width: 12,
    height: 22,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: "#78925a",
    transform: [{ rotate: "-10deg" }],
  },
  player: {
    position: "absolute",
    left: 0,
    width: GAME_CONFIG.playerWidth,
    alignItems: "center",
  },
  hud: {
    position: "absolute",
    top: 10,
    left: 18,
    right: 18,
    maxWidth: 340,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    backgroundColor: UI_THEME.hudBg,
    borderWidth: 1,
    borderColor: UI_THEME.hudBorder,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  scoreLabel: {
    fontSize: 11,
    color: UI_THEME.hudLabel,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 4,
    textAlign: "center",
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "900",
    color: UI_THEME.hudText,
    textAlign: "center",
  },
});
