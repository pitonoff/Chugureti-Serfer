import { Pressable, StyleSheet, Text } from "react-native";

type GameButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function GameButton({
  label,
  onPress,
  variant = "primary",
}: GameButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 146,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#6f3f2b",
    borderWidth: 1,
    borderColor: "#91614e",
    shadowColor: "#5a3426",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  secondary: {
    backgroundColor: "#f8ecdb",
    borderWidth: 1,
    borderColor: "#d9bda0",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#fff4e9",
  },
  secondaryLabel: {
    color: "#5b3829",
  },
});
