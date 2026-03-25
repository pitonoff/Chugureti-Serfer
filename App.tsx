import { Asset } from "expo-asset";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { GameOverScreen } from "./src/components/GameOverScreen";
import { GameScreen } from "./src/components/GameScreen";
import { BOMJ_FRAME_SOURCES } from "./src/config/bomjFrames";
import { GOP_FRAME_SOURCES } from "./src/config/gopFrames";
import { PLAYER_FRAME_SOURCES } from "./src/config/playerFrames";
import { StartScreen } from "./src/components/StartScreen";
import { UI_THEME } from "./src/config/uiTheme";
import { useTelegramMiniApp } from "./src/hooks/useTelegramMiniApp";

type ScreenState = "start" | "playing" | "game-over";

export default function App() {
  useTelegramMiniApp();

  const [screen, setScreen] = useState<ScreenState>("start");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [session, setSession] = useState(0);
  const [gameAssetsReady, setGameAssetsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Asset.loadAsync([
      ...PLAYER_FRAME_SOURCES,
      ...BOMJ_FRAME_SOURCES,
      ...GOP_FRAME_SOURCES,
      require("./assets/ui/col-transparent-web.png"),
      require("./assets/prius-top-cropped-web.png"),
      require("./assets/kal-prepped-web.png"),
      require("./assets/kolo-new-prepped-web.png"),
    ])
      .catch(() => null)
      .finally(() => {
        if (isMounted) {
          setGameAssetsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const startGame = useCallback(() => {
    if (!gameAssetsReady) {
      return;
    }

    setScore(0);
    setSession((value) => value + 1);
    setScreen("playing");
  }, [gameAssetsReady]);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setBestScore((currentBest) => Math.max(currentBest, finalScore));
    setScreen("game-over");
  }, []);

  const currentScreen = useMemo(() => {
    if (screen === "start") {
      return (
        <StartScreen
          bestScore={bestScore}
          isPreparing={!gameAssetsReady}
          onPlay={startGame}
        />
      );
    }

    if (screen === "playing") {
      return <GameScreen key={session} onGameOver={handleGameOver} />;
    }

    return (
      <GameOverScreen
        score={score}
        bestScore={bestScore}
        onRestart={startGame}
        onBackToMenu={() => setScreen("start")}
      />
    );
  }, [bestScore, handleGameOver, score, screen, session, startGame]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appShell}>{currentScreen}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI_THEME.parchment,
  },
  appShell: {
    flex: 1,
    backgroundColor: UI_THEME.parchment,
  },
});
