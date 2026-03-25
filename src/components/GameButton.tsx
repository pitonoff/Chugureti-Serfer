import { Pressable, StyleSheet, Text } from "react-native";
import { UI_THEME } from "../config/uiTheme";

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
    width: "100%",
    minWidth: 146,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: UI_THEME.red,
    borderWidth: 1,
    borderColor: UI_THEME.redDark,
    shadowColor: UI_THEME.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  secondary: {
    backgroundColor: UI_THEME.ivory,
    borderWidth: 1,
    borderColor: UI_THEME.border,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
  },
  primaryLabel: {
    color: UI_THEME.hudText,
  },
  secondaryLabel: {
    color: UI_THEME.redDark,
  },
});
