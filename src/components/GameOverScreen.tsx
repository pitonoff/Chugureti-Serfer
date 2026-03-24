import { StyleSheet, Text, View } from "react-native";
import { GameButton } from "./GameButton";

type GameOverScreenProps = {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
};

export function GameOverScreen({
  score,
  bestScore,
  onRestart,
  onBackToMenu,
}: GameOverScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBand} />
      <View style={styles.bottomBand} />
      <View style={styles.backgroundGlow} />
      <View style={styles.card}>
        <Text style={styles.label}>Game Over</Text>
        <Text style={styles.title}>Улица победила</Text>
        <Text style={styles.subtitle}>
          Еще один забег, и ты уже почти городской ниндзя.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Best</Text>
            <Text style={styles.statValue}>{bestScore}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <GameButton label="Restart" onPress={onRestart} />
          <GameButton
            label="Menu"
            onPress={onBackToMenu}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0cd9e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  topBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "#d98863",
  },
  bottomBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "#e5c39c",
  },
  backgroundGlow: {
    position: "absolute",
    top: 62,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255, 224, 186, 0.28)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fbefdf",
    borderWidth: 1,
    borderColor: "#d8b08b",
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: "#744c34",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#b55f3f",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#4f2b1d",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#7a5a45",
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f3e1ca",
    borderWidth: 1,
    borderColor: "#e2c5a6",
    borderRadius: 20,
    padding: 18,
  },
  statLabel: {
    fontSize: 14,
    color: "#8b7058",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#4f2b1d",
  },
  buttons: {
    gap: 12,
  },
});
