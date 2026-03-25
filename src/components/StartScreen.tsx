import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { UI_THEME } from "../config/uiTheme";
import { GameButton } from "./GameButton";

type StartScreenProps = {
  bestScore: number;
  isPreparing: boolean;
  onPlay: () => void;
};

export function StartScreen({
  bestScore,
  isPreparing,
  onPlay,
}: StartScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBand} />
      <View style={styles.bottomBand} />
      <View style={styles.backgroundGlow} />
      <View style={styles.crossVertical} />
      <View style={styles.crossHorizontal} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Endless runner</Text>
          <View style={styles.logoFrame}>
            <Image
              source={require("../../assets/logo-transparent-web.png")}
              style={styles.logo}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
          <Text style={styles.subtitle}>
            Беги по улице, меняй полосу, уклоняйся от Prius, люков, ям и прочих
            городских сюрпризов.
          </Text>

          <View style={styles.rules}>
            <Text style={styles.rule}>3 полосы движения</Text>
            <Text style={styles.rule}>Управление свайпами</Text>
            <Text style={styles.rule}>Скорость растет со временем</Text>
          </View>

          <View style={styles.statsPanel}>
            <View style={styles.bestScoreCard}>
              <Text style={styles.bestScoreLabel}>Best score</Text>
              <Text style={styles.bestScoreValue}>{bestScore}</Text>
            </View>
            <View style={styles.bestScoreCard}>
              <Text style={styles.bestScoreLabel}>Mode</Text>
              <Text style={styles.modeValue}>One hand</Text>
            </View>
          </View>

          <GameButton
            label={isPreparing ? "Подгружаем мир..." : "Play"}
            onPress={onPlay}
            disabled={isPreparing}
          />
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
    top: 58,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(201, 177, 120, 0.24)",
  },
  crossVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    marginLeft: -12,
    width: 24,
    backgroundColor: "rgba(162, 51, 44, 0.08)",
  },
  crossHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "34%",
    marginTop: -12,
    height: 24,
    backgroundColor: "rgba(162, 51, 44, 0.08)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    borderRadius: 32,
    backgroundColor: UI_THEME.ivory,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: UI_THEME.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    color: UI_THEME.red,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    textAlign: "center",
  },
  logoFrame: {
    width: "100%",
    height: 164,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logo: {
    width: "92%",
    height: "92%",
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: UI_THEME.inkSoft,
    marginBottom: 18,
    textAlign: "center",
  },
  rules: {
    gap: 10,
    marginBottom: 20,
  },
  rule: {
    fontSize: 16,
    color: UI_THEME.ink,
    backgroundColor: "#efe4cf",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
  },
  statsPanel: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  bestScoreCard: {
    flexGrow: 1,
    flexBasis: 160,
    borderRadius: 18,
    backgroundColor: "#efe4cf",
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  bestScoreLabel: {
    fontSize: 15,
    color: UI_THEME.inkSoft,
    marginBottom: 6,
  },
  bestScoreValue: {
    fontSize: 30,
    fontWeight: "800",
    color: UI_THEME.redDark,
  },
  modeValue: {
    fontSize: 22,
    fontWeight: "800",
    color: UI_THEME.redDark,
  },
});
