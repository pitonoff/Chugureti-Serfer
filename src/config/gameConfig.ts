import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const GAME_CONFIG = {
  lanes: 3,
  screenWidth,
  screenHeight,
  horizonHeight: Math.round(screenHeight * 0.13),
  roadWidth: Math.min(screenWidth - 28, 380),
  roadPadding: 18,
  playerAreaBottom: 154,
  playerWidth: 60,
  playerHeight: 96,
  playerDragLimit: 18,
  baseSpeed: 360,
  maxSpeed: 760,
  speedRampPerSecond: 7,
  baseSpawnInterval: 0.95,
  minSpawnInterval: 0.46,
  spawnRampFactor: 0.012,
  scorePerSecond: 12,
  stripeHeight: 28,
  stripeGap: 26,
  swipeThreshold: 34,
  obstacleCleanupOffset: 120,
  collisionLaneTolerance: 0.32,
} as const;

export const ROAD_LAYOUT = {
  left: (GAME_CONFIG.screenWidth - GAME_CONFIG.roadWidth) / 2,
  top: GAME_CONFIG.horizonHeight,
  height: GAME_CONFIG.screenHeight - GAME_CONFIG.horizonHeight,
} as const;

export const LANE_WIDTH = GAME_CONFIG.roadWidth / GAME_CONFIG.lanes;

export const PLAYER_Y =
  ROAD_LAYOUT.height - GAME_CONFIG.playerAreaBottom - GAME_CONFIG.playerHeight;

export const OBSTACLE_PRESETS = {
  poop: {
    type: "poop",
    width: 34,
    height: 28,
    color: "#7a4a2c",
    label: "💩",
  },
  pit: {
    type: "pit",
    width: 82,
    height: 40,
    color: "#2f3640",
    label: "",
  },
  car: {
    type: "car",
    width: 76,
    height: 142,
    color: "#d8573c",
    label: "🚗",
  },
} as const;
