import { StyleSheet, Text, View } from "react-native";
import { GameButton } from "./GameButton";

type StartScreenProps = {
  bestScore: number;
  onPlay: () => void;
};

export function StartScreen({ bestScore, onPlay }: StartScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBand} />
      <View style={styles.bottomBand} />
      <View style={styles.backgroundGlow} />
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Mini endless runner</Text>
        <Text style={styles.title}>Chugureti Serfer</Text>
        <Text style={styles.subtitle}>
          Беги по улице, меняй полосу и не вляпайся в неприятности.
        </Text>

        <View style={styles.previewStreet}>
          <View style={styles.previewRoad} />
          <View style={styles.previewSidewalkLeft} />
          <View style={styles.previewSidewalkRight} />
          <View style={styles.previewCar} />
          <View style={styles.previewRunner} />
        </View>

        <View style={styles.rules}>
          <Text style={styles.rule}>3 полосы движения</Text>
          <Text style={styles.rule}>Свайп или кнопки снизу</Text>
          <Text style={styles.rule}>Машины крупнее и опаснее</Text>
        </View>

        <View style={styles.bestScore}>
          <Text style={styles.bestScoreLabel}>Best score</Text>
          <Text style={styles.bestScoreValue}>{bestScore}</Text>
        </View>

        <GameButton label="Play" onPress={onPlay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1d0a3",
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
    backgroundColor: "#efb46f",
  },
  bottomBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "#e4c39c",
  },
  backgroundGlow: {
    position: "absolute",
    top: 48,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255, 237, 195, 0.42)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 32,
    backgroundColor: "#fbefdf",
    borderWidth: 1,
    borderColor: "#d8b08b",
    paddingHorizontal: 24,
    paddingVertical: 34,
    shadowColor: "#744c34",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    color: "#b55f3f",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#4f2b1d",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#7a5a45",
    marginBottom: 20,
  },
  previewStreet: {
    height: 96,
    borderRadius: 22,
    backgroundColor: "#edd3ae",
    overflow: "hidden",
    marginBottom: 24,
  },
  previewRoad: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "25%",
    right: "25%",
    backgroundColor: "#4a4b4f",
  },
  previewSidewalkLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "25%",
    backgroundColor: "#ccb18a",
  },
  previewSidewalkRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "25%",
    backgroundColor: "#ccb18a",
  },
  previewCar: {
    position: "absolute",
    top: 10,
    left: "54%",
    width: 34,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#e8e2d8",
    borderWidth: 2,
    borderColor: "#faf5ef",
  },
  previewRunner: {
    position: "absolute",
    bottom: 12,
    left: "38%",
    width: 22,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#1d7c62",
    borderWidth: 2,
    borderColor: "#d6fff6",
  },
  rules: {
    gap: 10,
    marginBottom: 28,
  },
  rule: {
    fontSize: 16,
    color: "#5a3d2f",
    backgroundColor: "#f3e1ca",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2c5a6",
  },
  bestScore: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 24,
  },
  bestScoreLabel: {
    fontSize: 15,
    color: "#8b7058",
  },
  bestScoreValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#4f2b1d",
  },
});
