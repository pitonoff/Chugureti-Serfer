export type ObstacleType = "poop" | "pit" | "manhole" | "car";

export type Obstacle = {
  id: number;
  lane: number;
  type: ObstacleType;
  y: number;
  width: number;
  height: number;
};
