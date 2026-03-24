import { Pressable, StyleSheet, Text, View } from "react-native";

type LaneControlsProps = {
  onMoveLeft: () => void;
  onMoveRight: () => void;
};

export function LaneControls({
  onMoveLeft,
  onMoveRight,
}: LaneControlsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onMoveLeft}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.arrow}>←</Text>
      </Pressable>
      <Pressable
        onPress={onMoveRight}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.arrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: 76,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(93, 62, 45, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(234, 211, 178, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  arrow: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff3e1",
  },
});
