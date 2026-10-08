import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { buildMeetingPayload, pad, TIME_SLOTS, todayISO, upcomingDays } from "../lib";
import { radius, space, type, useTheme } from "../theme";
import { Button, Chip, Icon, SectionTitle } from "./ui";

const EMPTY = { name: "", email: "", phone: "", topic: "", date: "", time: "", consent: false };

const dayLabel = iso => new Date(`${iso}T12:00`).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" });

export default function MeetingForm({ profile: p, onStatus }) {
  const { c } = useTheme();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const days = useMemo(upcomingDays, []);

  // Bugün seçiliyse geçmiş saatleri gizle
  const slots = useMemo(() => {
    if (form.date !== todayISO()) return TIME_SLOTS;
    const now = new Date();
    const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return TIME_SLOTS.filter(t => t > nowStr);
  }, [form.date]);

  const set = key => value => setForm(f => {
    const next = { ...f, [key]: value };
    if (key === "date") next.time = "";
    return next;
  });

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Hata: adınızı yazın.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Hata: geçerli bir e-posta yazın.";
    if (!form.topic.trim()) e.topic = "Hata: konuyu yazın.";
    if (!form.date || form.date < todayISO()) e.date = "Hata: bir tarih seçin.";
    if (!form.time) e.time = "Hata: bir saat seçin.";
    if (!form.consent) e.consent = "Hata: devam etmek için onay verin.";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setMessage(""); return; }

    const dateText = new Date(`${form.date}T${form.time}`).toLocaleDateString("tr-TR",
      { day: "numeric", month: "long", year: "numeric", weekday: "long" });
    setSending(true);
    setMessage("Gönderiliyor…");
    try {
      if (p.meetingWebhook) {
        const res = await fetch(p.meetingWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildMeetingPayload(form, p, dateText))
        });
        if (!res.ok) throw new Error(res.status);
      } else {
        // Webhook yoksa e-posta taslağı açılır
        const body = `Merhaba ${p.firstName},\n\nSizinle bir toplantı planlamak istiyorum.\n\n` +
          `Ad Soyad: ${form.name}\nE-posta: ${form.email}\nTelefon: ${form.phone || "-"}\n` +
          `Konu: ${form.topic}\nTarih: ${dateText}\nSaat: ${form.time}\n`;
        await Linking.openURL(`mailto:${p.email}?subject=${encodeURIComponent("Toplantı talebi: " + form.topic)}` +
          `&body=${encodeURIComponent(body)}`);
      }
      const ok = p.meetingWebhook
        ? `Talebiniz alındı: ${dateText}, ${form.time}.`
        : "E-posta taslağı açıldı. Göndermek için e-postayı onaylayın.";
      setMessage(ok);
      onStatus(ok);
      setForm(EMPTY);
    } catch (err) {
      const fail = "Hata: bağlantı kurulamadı. Tekrar deneyin.";
      setMessage(fail);
      onStatus(fail);
    }
    setSending(false);
  }

  const Label = ({ children }) => <Text style={[type.caption, { color: c.inkMuted }]}>{children}</Text>;
  const Err = ({ k }) => errors[k] ? <Text style={[type.caption, { color: c.danger }]}>{errors[k]}</Text> : null;

  const field = (key, label, extra = {}) => (
    <View style={{ gap: space[1] }}>
      <Label>{label}</Label>
      <TextInput value={form[key]} onChangeText={set(key)} accessibilityLabel={label}
                 placeholderTextColor={c.inkMuted}
                 style={[type.body, {
                   minHeight: 48, paddingHorizontal: space[3], borderWidth: 1.5, borderRadius: radius.md,
                   borderColor: errors[key] ? c.danger : c.lineStrong, backgroundColor: c.surfaceRaised, color: c.ink
                 }]} {...extra} />
      <Err k={key} />
    </View>
  );

  return (
    <View style={{ marginTop: space[6] }}>
      <SectionTitle dot>Toplantı Talep Et</SectionTitle>
      <View style={{ gap: space[3] }}>
        {field("name", "Ad Soyad", { autoComplete: "name", textContentType: "name" })}
        {field("email", "E-posta", { autoComplete: "email", textContentType: "emailAddress", keyboardType: "email-address", autoCapitalize: "none" })}
        {field("phone", "Telefon", { autoComplete: "tel", textContentType: "telephoneNumber", keyboardType: "phone-pad" })}
        {field("topic", "Konu")}

        <View style={{ gap: space[1] }}>
          <Label>Tarih</Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }}>
            {days.map(d => <Chip key={d} label={dayLabel(d)} selected={form.date === d} onPress={() => set("date")(d)} />)}
          </ScrollView>
          <Err k="date" />
        </View>

        <View style={{ gap: space[1] }}>
          <Label>Saat</Label>
          {!form.date
            ? <Text style={[type.caption, { color: c.inkMuted }]}>Önce tarih seçin.</Text>
            : slots.length === 0
              ? <Text style={[type.caption, { color: c.danger }]}>Bugün için uygun saat kalmadı. Başka bir gün seçin.</Text>
              : <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                  {slots.map(t => <Chip key={t} label={t} selected={form.time === t} onPress={() => set("time")(t)} />)}
                </View>}
          <Err k="time" />
        </View>

        <View style={{ flexDirection: "row", gap: space[2], alignItems: "flex-start" }}>
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: form.consent }}
                     accessibilityLabel="KVKK Aydınlatma Metni'ni okudum"
                     hitSlop={12} onPress={() => set("consent")(!form.consent)}
                     style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, alignItems: "center", justifyContent: "center",
                              borderColor: errors.consent ? c.danger : form.consent ? c.brand : c.lineStrong,
                              backgroundColor: form.consent ? c.brand : "transparent" }}>
            {form.consent && <Icon name="check" color={c.onBrand} size={14} />}
          </Pressable>
          <Text style={[type.caption, { color: c.inkMuted, flex: 1 }]}>
            <Text accessibilityRole="link" style={{ color: c.brand, textDecorationLine: "underline" }}
                  onPress={() => Linking.openURL(p.kvkkUrl).catch(() => {})}>KVKK Aydınlatma Metni</Text>'ni okudum.
          </Text>
        </View>
        <Err k="consent" />

        <Button variant="accent" icon="calendar" label={sending ? "Gönderiliyor…" : "Talep Gönder"}
                disabled={sending} onPress={handleSubmit} />
        {!!message && <Text accessibilityLiveRegion="polite" style={[type.caption, { color: c.ink }]}>{message}</Text>}
      </View>
    </View>
  );
}
