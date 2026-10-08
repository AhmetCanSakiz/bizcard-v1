import { useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces/600SemiBold";
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans/400Regular";
import { PlusJakartaSans_500Medium } from "@expo-google-fonts/plus-jakarta-sans/500Medium";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { PROFILE } from "./src/profile";
import { space, type, useTheme } from "./src/theme";
import ProfileCard from "./src/components/ProfileCard";
import ChatWidget from "./src/components/ChatWidget";

export default function App() {
  const { scheme, c } = useTheme();
  const [status, setStatus] = useState("");
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_600SemiBold,
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold
  });

  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: c.surface }} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={["top", "left", "right"]}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <ScrollView keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ alignItems: "center", gap: space[6],
                                             paddingVertical: space[8], paddingHorizontal: space[4], paddingBottom: 96 }}>
          <ProfileCard profile={PROFILE} onStatus={setStatus} />
          <View style={{ alignItems: "center", gap: space[2] }}>
            <Text style={[type.caption, { fontFamily: "PlusJakartaSans_700Bold", color: c.ink }]}>BizCard</Text>
            <Text accessibilityRole="link" onPress={() => Linking.openURL(PROFILE.privacyUrl).catch(() => {})}
                  style={[type.caption, { color: c.inkMuted, textDecorationLine: "underline" }]}>
              Gizlilik Politikası
            </Text>
          </View>
          <Text accessibilityLiveRegion="polite" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}>{status}</Text>
        </ScrollView>
        <ChatWidget profile={PROFILE} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
