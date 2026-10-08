import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import { fullNameOf } from "../lib";
import { radius, space, type, useTheme } from "../theme";
import { Button } from "./ui";

// Soru sor: n8n Chat Trigger ile konuşur. Sohbet yalnızca uygulama açıkken tutulur.
export default function ChatWidget({ profile: p }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(() => Crypto.randomUUID());
  const logRef = useRef(null);

  useEffect(() => { logRef.current?.scrollToEnd({ animated: true }); }, [messages, sending]);

  async function send() {
    const q = text.trim();
    if (!q || sending) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setText("");
    if (!p.chatWebhook) {
      setMessages(m => [...m, { role: "error", text: "Hata: sohbet henüz bağlı değil. Lütfen e-posta ile yazın." }]);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(p.chatWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendMessage", sessionId, chatInput: q })
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const reply = Array.isArray(data) ? data[0] : data;
      setMessages(m => [...m, { role: "bot", text: (reply && (reply.output || reply.text)) || "Cevap alınamadı." }]);
    } catch (err) {
      setMessages(m => [...m, { role: "error", text: "Hata: bağlantı kurulamadı. Tekrar deneyin." }]);
    }
    setSending(false);
  }

  const bubble = role => ({
    maxWidth: "85%", paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md,
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    backgroundColor: role === "user" ? c.brand : c.surfaceSunken
  });
  const bubbleText = role => ({
    fontFamily: "PlusJakartaSans_400Regular", fontSize: 14, lineHeight: 20,
    color: role === "user" ? c.onBrand : role === "error" ? c.danger : c.ink
  });

  return (
    <>
      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                              style={{ flex: 1, justifyContent: "flex-end" }}>
          <View accessibilityViewIsModal
                style={{ maxHeight: "80%", gap: space[3], padding: space[4], paddingBottom: space[4] + insets.bottom,
                         backgroundColor: c.surfaceRaised, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
                         borderWidth: 1, borderColor: c.lineStrong }}>
            <Text style={[type.caption, { color: c.inkMuted }]}>
              {fullNameOf(p)} hakkında soru sorun. Cevaplar paylaşılan dokümanlardan üretilir.
            </Text>
            {messages.length > 0 && (
              <ScrollView ref={logRef} accessibilityLiveRegion="polite" contentContainerStyle={{ gap: space[2] }}>
                {messages.map((m, i) => <View key={i} style={bubble(m.role)}><Text style={bubbleText(m.role)}>{m.text}</Text></View>)}
                {sending && <View style={bubble("bot")}><Text style={bubbleText("bot")}>Yazıyor…</Text></View>}
              </ScrollView>
            )}
            <View style={{ gap: space[1] }}>
              <Text style={[type.caption, { color: c.inkMuted }]}>Sorunuz</Text>
              <TextInput value={text} onChangeText={setText} autoFocus accessibilityLabel="Sorunuz"
                         placeholder="Örn: Hangi projelerde çalıştı?" placeholderTextColor={c.inkMuted}
                         returnKeyType="send" onSubmitEditing={send} autoComplete="off"
                         style={[type.body, { minHeight: 48, paddingHorizontal: space[3], borderWidth: 1.5,
                                              borderRadius: radius.md, borderColor: c.lineStrong, color: c.ink }]} />
            </View>
            <Button label={sending ? "Gönderiliyor…" : "Gönder"} disabled={sending || !text.trim()} onPress={send} />
            <Button variant="secondary" label="Kapat" onPress={() => setOpen(false)} />
            <Text style={[type.caption, { color: c.inkMuted }]}>Sohbet kaydedilmez, sadece bu oturumda tutulur.</Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Button label="Soru sor" onPress={() => setOpen(true)}
              style={{ position: "absolute", right: space[4], bottom: space[4] + insets.bottom, borderRadius: radius.full }} />
    </>
  );
}
