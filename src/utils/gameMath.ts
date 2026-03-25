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
  const initialY =
    type === "car"
      ? -Math.round(preset.height + 220)
      : type === "pit" || type === "manhole" || type === "bomj"
        ? -Math.round(preset.height + 320)
        : -Math.round(preset.height + 160);

  return {
    id,
    lane,
    type,
    y: initialY,
    width: preset.width,
    height: preset.height,
  };
}

export function getRandomObstacleType(): ObstacleType {
  const roll = Math.random();

  if (roll < 0.2) {
    return "car";
  }

  if (roll < 0.4) {
    return "pit";
  }

  if (roll < 0.58) {
    return "bomj";
  }

  if (roll < 0.76) {
    return "manhole";
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
    const hitboxInset =
      obstacle.type === "pit" || obstacle.type === "manhole"
        ? { horizontal: 1, top: 2, bottom: 1 }
        : obstacle.type === "bomj"
          ? { horizontal: 6, top: 4, bottom: 4 }
        : obstacle.type === "car"
          ? { horizontal: 6, top: 6, bottom: 6 }
          : { horizontal: 6, top: 6, bottom: 6 };

    const obstacleLeft =
      getLaneLeftX(obstacle.lane, obstacle.width) + hitboxInset.horizontal;
    const obstacleRight =
      obstacleLeft + obstacle.width - hitboxInset.horizontal * 2;
    const obstacleTop = obstacle.y + hitboxInset.top;
    const obstacleBottom = obstacle.y + obstacle.height - hitboxInset.bottom;

    const intersectsHorizontally =
      obstacleRight >= playerLeft && obstacleLeft <= playerRight;
    const intersectsVertically =
      obstacleBottom >= playerTop && obstacleTop <= playerBottom;

    return intersectsHorizontally && intersectsVertically;
  });
}
