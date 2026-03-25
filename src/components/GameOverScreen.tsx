import { ScrollView, StyleSheet, Text, View } from "react-native";
import { UI_THEME } from "../config/uiTheme";
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_THEME.parchment,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  topBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: UI_THEME.red,
  },
  bottomBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: UI_THEME.parchmentWarm,
  },
  backgroundGlow: {
    position: "absolute",
    top: 62,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(201, 177, 120, 0.2)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: UI_THEME.ivory,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: UI_THEME.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: UI_THEME.red,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: UI_THEME.redDark,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: UI_THEME.inkSoft,
    marginBottom: 24,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 26,
    alignItems: "stretch",
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 160,
    backgroundColor: "#efe4cf",
    borderWidth: 1,
    borderColor: UI_THEME.border,
    borderRadius: 20,
    padding: 18,
  },
  statLabel: {
    fontSize: 14,
    color: UI_THEME.inkSoft,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 30,
    fontWeight: "800",
    color: UI_THEME.redDark,
  },
  buttons: {
    gap: 12,
    alignItems: "stretch",
  },
});
