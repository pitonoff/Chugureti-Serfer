import { Asset } from "expo-asset";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GameOverScreen } from "./src/components/GameOverScreen";
import { GameScreen } from "./src/components/GameScreen";
import { StartScreen } from "./src/components/StartScreen";

type ScreenState = "start" | "playing" | "game-over";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("start");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [session, setSession] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Asset.loadAsync([
      require("./assets/prius-top-cropped.png"),
      require("./assets/pit.png"),
    ])
      .catch(() => null)
      .finally(() => {
        if (isMounted) {
          setAssetsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setSession((value) => value + 1);
    setScreen("playing");
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setBestScore((currentBest) => Math.max(currentBest, finalScore));
    setScreen("game-over");
  }, []);

  const currentScreen = useMemo(() => {
    if (screen === "start") {
      return <StartScreen bestScore={bestScore} onPlay={startGame} />;
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

  if (!assetsReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingShell}>
          <Text style={styles.loadingTitle}>Chugureti Serfer</Text>
          <Text style={styles.loadingText}>Подгружаем улицу и спрайты...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
    backgroundColor: "#f2eee6",
  },
  appShell: {
    flex: 1,
    backgroundColor: "#f2eee6",
  },
  loadingShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecd9bd",
    padding: 24,
  },
  loadingTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#4f2b1d",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 17,
    color: "#7a5a45",
  },
});
