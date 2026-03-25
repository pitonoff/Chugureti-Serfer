import { useEffect } from "react";
import { Platform } from "react-native";

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  setBackgroundColor?: (color: string) => void;
  setHeaderColor?: (color: string) => void;
  disableVerticalSwipes?: () => void;
  safeAreaInset?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  contentSafeAreaInset?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function useTelegramMiniApp() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    let isCancelled = false;

    const setupWebApp = () => {
      if (isCancelled) {
        return;
      }

      const webApp = window.Telegram?.WebApp;

      if (!webApp) {
        return;
      }

      webApp.ready?.();
      webApp.expand?.();
      webApp.setBackgroundColor?.("#f4ecd9");
      webApp.setHeaderColor?.("#a2332c");
      webApp.disableVerticalSwipes?.();
    };

    if (window.Telegram?.WebApp) {
      setupWebApp();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = setupWebApp;
    document.head.appendChild(script);

    return () => {
      isCancelled = true;
    };
  }, []);
}

export function getTelegramTopInset() {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return 0;
  }

  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    return 0;
  }

  const explicitInset =
    webApp.contentSafeAreaInset?.top ?? webApp.safeAreaInset?.top ?? 0;

  if (explicitInset > 0) {
    return explicitInset + 56;
  }

  return 92;
}
