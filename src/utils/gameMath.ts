import { GAME_CONFIG, LANE_WIDTH, OBSTACLE_PRESETS, PLAYER_Y, ROAD_LAYOUT } from "../config/gameConfig";
import { Obstacle, ObstacleType } from "../types/game";

export function getLaneCenterX(lane: number) {
  return ROAD_LAYOUT.left + lane * LANE_WIDTH + LANE_WIDTH / 2;
}

export function getLaneLeftX(lane: number, width: number) {
  return getLaneCenterX(lane) - width / 2;
}

export function getSpawnInterval(elapsedSeconds: number) {
  const interval =
    GAME_CONFIG.baseSpawnInterval - elapsedSeconds * GAME_CONFIG.spawnRampFactor;

  return Math.max(GAME_CONFIG.minSpawnInterval, interval);
}

export function getGameSpeed(elapsedSeconds: number) {
  const speed =
    GAME_CONFIG.baseSpeed + elapsedSeconds * GAME_CONFIG.speedRampPerSecond;

  return Math.min(GAME_CONFIG.maxSpeed, speed);
}

export function createObstacle(id: number, lane: number, type: ObstacleType): Obstacle {
  const preset = OBSTACLE_PRESETS[type];

  return {
    id,
    lane,
    type,
    y: -preset.height - 24,
    width: preset.width,
    height: preset.height,
  };
}

export function getRandomObstacleType(): ObstacleType {
  const roll = Math.random();

  if (roll < 0.22) {
    return "car";
  }

  if (roll < 0.6) {
    return "pit";
  }

  return "poop";
}

export function checkCollision(
  playerLane: number,
  playerOffsetX: number,
  obstacles: Obstacle[],
) {
  const playerCenterX = getLaneCenterX(playerLane) + playerOffsetX;
  const playerLeft = playerCenterX - GAME_CONFIG.playerWidth / 2 + 8;
  const playerRight = playerCenterX + GAME_CONFIG.playerWidth / 2 - 8;
  const playerTop = PLAYER_Y + 10;
  const playerBottom = PLAYER_Y + GAME_CONFIG.playerHeight - 8;

  return obstacles.some((obstacle) => {
    const obstacleLeft = getLaneLeftX(obstacle.lane, obstacle.width) + 6;
    const obstacleRight = obstacleLeft + obstacle.width - 12;
    const obstacleTop = obstacle.y + 6;
    const obstacleBottom = obstacle.y + obstacle.height - 6;

    const intersectsHorizontally =
      obstacleRight >= playerLeft && obstacleLeft <= playerRight;
    const intersectsVertically =
      obstacleBottom >= playerTop && obstacleTop <= playerBottom;

    return intersectsHorizontally && intersectsVertically;
  });
}
