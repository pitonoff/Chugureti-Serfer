import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  GAME_CONFIG,
  PLAYER_Y,
  ROAD_LAYOUT,
} from "../config/gameConfig";
import { useGameLoop } from "../hooks/useGameLoop";
import { Obstacle } from "../types/game";
import {
  checkCollision,
  createObstacle,
  getGameSpeed,
  getLaneCenterX,
  getRandomObstacleType,
  getSpawnInterval,
} from "../utils/gameMath";
import { LaneControls } from "./LaneControls";
import { ObstacleView } from "./ObstacleView";
import { PlayerAvatar } from "./PlayerAvatar";

type GameScreenProps = {
  onGameOver: (score: number) => void;
};

export function GameScreen({ onGameOver }: GameScreenProps) {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [roadOffset, setRoadOffset] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const laneRef = useRef(1);
  const spawnTimerRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const gameOverTriggeredRef = useRef(false);
  const laneX = useRef(new Animated.Value(getLaneCenterX(1))).current;
  const dragX = useRef(new Animated.Value(0)).current;
  const dragOffsetRef = useRef(0);
  const runCycle = useRef(new Animated.Value(0)).current;
  const scoreRef = useRef(0);

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

  const moveToLane = useCallback((nextLane: number) => {
    const clampedLane = Math.max(0, Math.min(GAME_CONFIG.lanes - 1, nextLane));

    laneRef.current = clampedLane;
    dragOffsetRef.current = 0;
    dragX.setValue(0);

    Animated.spring(laneX, {
      toValue: getLaneCenterX(clampedLane),
      useNativeDriver: true,
      speed: 18,
      bounciness: 7,
    }).start();
  }, [dragX, laneX]);

  const moveLeft = useCallback(() => {
    moveToLane(laneRef.current - 1);
  }, [moveToLane]);

  const moveRight = useCallback(() => {
    moveToLane(laneRef.current + 1);
  }, [moveToLane]);

  const endGame = useCallback(
    (finalScore: number) => {
      if (gameOverTriggeredRef.current) {
        return;
      }

      gameOverTriggeredRef.current = true;
      setIsRunning(false);
      onGameOver(finalScore);
    },
    [onGameOver],
  );

  useGameLoop(
    isRunning,
    useCallback(
      (deltaSeconds, elapsedSeconds) => {
        const speed = getGameSpeed(elapsedSeconds);
        const stripeCycle =
          GAME_CONFIG.stripeHeight + GAME_CONFIG.stripeGap;
        const nextScore = Math.floor(
          elapsedSeconds * GAME_CONFIG.scorePerSecond,
        );

        setElapsed(elapsedSeconds);
        setRoadOffset((current) => (current + speed * deltaSeconds) % stripeCycle);
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
              dragOffsetRef.current,
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
          Math.abs(gestureState.dx) > 6 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderMove: (_, gestureState) => {
          const limitedOffset = Math.max(
            -GAME_CONFIG.playerDragLimit,
            Math.min(GAME_CONFIG.playerDragLimit, gestureState.dx * 0.3),
          );

          dragOffsetRef.current = limitedOffset;
          dragX.setValue(limitedOffset);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx <= -GAME_CONFIG.swipeThreshold) {
            moveLeft();
          } else if (gestureState.dx >= GAME_CONFIG.swipeThreshold) {
            moveRight();
          } else {
            dragOffsetRef.current = 0;
            Animated.spring(dragX, {
              toValue: 0,
              useNativeDriver: true,
              speed: 18,
              bounciness: 6,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          dragOffsetRef.current = 0;
          Animated.spring(dragX, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 6,
          }).start();
        },
      }),
    [dragX, moveLeft, moveRight],
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
        {
          rotate: runCycle.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ["-2deg", "1deg", "-2deg"],
          }),
        },
      ],
    }),
    [runCycle],
  );

  const asphaltDetails = useMemo(() => {
    const details = [
      { top: 118, left: 36, width: 92, rotation: "-2deg", crackHeight: 0 },
      { top: 284, left: 152, width: 78, rotation: "2deg", crackHeight: 18 },
      { top: 498, left: 78, width: 102, rotation: "-1deg", crackHeight: 0 },
    ];

    return details.map((detail, index) => {
      return (
        <View key={index}>
          <View
            style={[
              styles.asphaltPatch,
              {
                top: detail.top,
                left: detail.left,
                width: detail.width,
                transform: [{ rotate: detail.rotation }],
              },
            ]}
          />
          {detail.crackHeight > 0 ? (
            <View
              style={[
                styles.roadCrack,
                {
                  top: detail.top + 8,
                  left: detail.left + detail.width * 0.4,
                  height: detail.crackHeight,
                  transform: [{ rotate: detail.rotation }],
                },
              ]}
            />
          ) : null}
        </View>
      );
    });
  }, []);

  const oilSpills = useMemo(
    () => [
      { top: 196, left: GAME_CONFIG.roadWidth / 2 - 20, width: 40, height: 10, rotate: "-3deg" },
      { top: 414, left: 42, width: 34, height: 9, rotate: "4deg" },
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
        {asphaltDetails}
        {oilSpills.map((spill, index) => (
          <View
            key={index}
            style={[
              styles.oilSpill,
              {
                top: spill.top,
                left: spill.left,
                width: spill.width,
                height: spill.height,
                transform: [{ rotate: spill.rotate }],
              },
            ]}
          />
        ))}
        {obstacles.map((obstacle) => (
          <ObstacleView key={obstacle.id} obstacle={obstacle} />
        ))}
        <Animated.View
          style={[
            styles.player,
            {
              transform: [
                {
                  translateX: Animated.subtract(
                    Animated.add(laneX, dragX),
                    GAME_CONFIG.playerWidth / 2,
                  ),
                },
              ],
              top: PLAYER_Y,
            },
          ]}
        >
          <Animated.View style={runnerAnimationStyle}>
            <PlayerAvatar runCycle={runCycle} />
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.hud}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Очки</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Темп</Text>
          <Text style={styles.scoreValue}>{Math.round(currentSpeed)}</Text>
        </View>
      </View>

      <LaneControls onMoveLeft={moveLeft} onMoveRight={moveRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1cda1",
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
    right: 6,
    width: 132,
    height: 132,
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
    left: 22,
    right: 22,
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
    left: 24,
    right: 24,
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
  oilSpill: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(27, 29, 31, 0.22)",
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
    top: 26,
    left: 18,
    right: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreCard: {
    minWidth: 108,
    backgroundColor: "rgba(88, 50, 28, 0.86)",
    borderWidth: 1,
    borderColor: "rgba(255, 232, 205, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#f0d2aa",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff5e9",
  },
});
