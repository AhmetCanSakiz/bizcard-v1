import { Pressable, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { radius, space, type, useTheme } from "../theme";

// İkonlar (design system: stroke="currentColor")
const paths = {
  phone:    <Path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail:     <><Rect x="3" y="5" width="18" height="14" rx="2" /><Path d="m3 7 9 6 9-6" /></>,
  globe:    <><Circle cx="12" cy="12" r="9" /><Path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  pin:      <><Path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" /><Circle cx="12" cy="9.5" r="2.5" /></>,
  save:     <Path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  calendar: <><Rect x="3" y="5" width="18" height="16" rx="2" /><Path d="M3 10h18M8 3v4M16 3v4" /></>,
  check:    <Path d="m5 12 5 5 9-10" />
};

export function Icon({ name, color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </Svg>
  );
}

export function Button({ variant = "primary", label, icon, onPress, disabled, style }) {
  const { c } = useTheme();
  const v = {
    primary:   { bg: c.brand, fg: c.onBrand, border: "transparent" },
    secondary: { bg: "transparent", fg: c.ink, border: c.lineStrong },
    accent:    { bg: c.accent, fg: c.onAccent, border: "transparent" }
  }[variant];
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }}
               disabled={disabled} onPress={onPress}
               style={({ pressed }) => [{
                 minHeight: 48, paddingHorizontal: space[6], borderRadius: radius.md,
                 borderWidth: 1.5, borderColor: v.border, backgroundColor: v.bg,
                 flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2],
                 opacity: disabled ? 0.45 : pressed ? 0.85 : 1
               }, style]}>
      {icon && <Icon name={icon} color={v.fg} />}
      <Text style={[type.label, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Divider() {
  const { c } = useTheme();
  return <View style={{ height: 1, backgroundColor: c.line, marginTop: space[6], marginBottom: space[2] }} />;
}

export function SectionTitle({ children, dot, center }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], marginBottom: space[2],
                   justifyContent: center ? "center" : "flex-start" }}>
      {dot && <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: c.accent }} />}
      <Text accessibilityRole="header" style={[type.label, { color: c.ink }]}>{children}</Text>
    </View>
  );
}

export function Chip({ label, selected, onPress, disabled }) {
  const { c } = useTheme();
  const style = {
    paddingVertical: space[1], paddingHorizontal: space[3], borderRadius: radius.full,
    backgroundColor: selected ? c.brand : c.brandSoft
  };
  const text = <Text style={[type.caption, { color: selected ? c.onBrand : c.ink }]}>{label}</Text>;
  if (!onPress) return <View style={style}>{text}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected, disabled: !!disabled }}
               disabled={disabled} onPress={onPress}
               style={({ pressed }) => [style, { minHeight: 40, justifyContent: "center", opacity: pressed ? 0.85 : 1 }]}>
      {text}
    </Pressable>
  );
}
