import { useEffect, useRef } from "react";

type FrameHandler = (deltaSeconds: number, elapsedSeconds: number) => void;

export function useGameLoop(isRunning: boolean, onFrame: FrameHandler) {
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef(0);
  const frameHandlerRef = useRef(onFrame);

  useEffect(() => {
    frameHandlerRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      previousTimeRef.current = null;
      elapsedTimeRef.current = 0;
      return;
    }

    const tick = (timestamp: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - previousTimeRef.current) / 1000,
        0.05,
      );

      previousTimeRef.current = timestamp;
      elapsedTimeRef.current += deltaSeconds;
      frameHandlerRef.current(deltaSeconds, elapsedTimeRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isRunning]);
}
