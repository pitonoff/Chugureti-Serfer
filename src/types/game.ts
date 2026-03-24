export type ObstacleType = "poop" | "pit" | "car";

export type Obstacle = {
  id: number;
  lane: number;
  type: ObstacleType;
  y: number;
  width: number;
  height: number;
};
