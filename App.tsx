import { Asset } from "expo-asset";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Asset.loadAsync([
      ...PLAYER_FRAME_SOURCES,
      ...BOMJ_FRAME_SOURCES,
      ...GOP_FRAME_SOURCES,
      require("./assets/logo-transparent.png"),
      require("./assets/ui/col-transparent.png"),
      require("./assets/ui/logo.png"),
      require("./assets/prius-top-cropped.png"),
      require("./assets/kal-prepped.png"),
      require("./assets/kolo-new-prepped.png"),
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
          <Image
            source={require("./assets/ui/logo.png")}
            style={styles.loadingLogo}
            resizeMode="cover"
          />
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
    backgroundColor: UI_THEME.parchment,
  },
  appShell: {
    flex: 1,
    backgroundColor: UI_THEME.parchment,
  },
  loadingShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI_THEME.parchmentWarm,
    padding: 24,
  },
  loadingLogo: {
    width: 172,
    height: 258,
    borderRadius: 28,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: UI_THEME.ivory,
    backgroundColor: UI_THEME.ivory,
    shadowColor: UI_THEME.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  loadingTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: UI_THEME.redDark,
    marginBottom: 10,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 17,
    color: UI_THEME.inkSoft,
    textAlign: "center",
  },
});
