// BizCard token'ları — kaynak: ../bizcard-design-system/tokens.json
import { useColorScheme } from "react-native";

const colors = {
  light: {
    surface: "#faf8f5", surfaceRaised: "#ffffff", surfaceSunken: "#f1ede7",
    ink: "#1c2426", inkMuted: "#56615f", line: "#e2dcd3", lineStrong: "#808a86",
    brand: "#0e6b63", onBrand: "#ffffff", brandSoft: "#d7eeea",
    accent: "#e8963a", onAccent: "#2a1a05", danger: "#b42318"
  },
  dark: {
    surface: "#101615", surfaceRaised: "#182120", surfaceSunken: "#0b100f",
    ink: "#edf2f0", inkMuted: "#9daba8", line: "#2a3533", lineStrong: "#6b7a77",
    brand: "#3fc9b7", onBrand: "#062420", brandSoft: "#173b37",
    accent: "#f0a955", onAccent: "#2a1a05", danger: "#f97066"
  }
};

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 };
export const radius = { sm: 8, md: 12, lg: 24, full: 999 };

export const fonts = {
  display: "Fraunces_600SemiBold",
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold"
};

export const type = {
  cardName: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, letterSpacing: -0.32 },
  role:     { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22 },
  body:     { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  label:    { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption:  { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.24 }
};

export function useTheme() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const c = colors[scheme];
  const shadowCard = scheme === "dark"
    ? { shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 12 }, elevation: 6 }
    : { shadowColor: "#1c2426", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 12 }, elevation: 4 };
  return { scheme, c, shadowCard };
}
