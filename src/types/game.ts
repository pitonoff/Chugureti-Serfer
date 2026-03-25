export type ObstacleType = "poop" | "pit" | "manhole" | "bomj" | "car";

export type Obstacle = {
  id: number;
  lane: number;
  type: ObstacleType;
  y: number;
  width: number;
  height: number;
};
