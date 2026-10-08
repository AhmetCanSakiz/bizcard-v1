import { useMemo, useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import qrcode from "qrcode-generator";
import { buildVCard, fullNameOf, stripProto } from "../lib";
import { radius, space, type, useTheme } from "../theme";
import { Button, Chip, Divider, Icon, SectionTitle } from "./ui";
import MeetingForm from "./MeetingForm";

const open = url => Linking.openURL(url).catch(() => {});

function Avatar({ firstName, lastName, photo }) {
  const { c } = useTheme();
  const initials = (firstName[0] + (lastName[0] || "")).toLocaleUpperCase("tr");
  return (
    <View accessible={false} style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: c.brandSoft,
                                     alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {photo
        ? <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
        : <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 28, color: c.brand }}>{initials}</Text>}
    </View>
  );
}

function ContactList({ profile: p }) {
  const { c } = useTheme();
  const rows = [
    p.phone    && { label: "Telefon", value: p.phoneText,           href: `tel:${p.phone}`,    icon: "phone" },
    p.email    && { label: "E-posta", value: p.email,               href: `mailto:${p.email}`, icon: "mail" },
    p.website  && { label: "Web",     value: stripProto(p.website), href: p.website,           icon: "globe" },
    p.location && { label: "Konum",   value: p.location,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.location)}`, icon: "pin" }
  ].filter(Boolean);
  const social = [
    p.linkedin && { label: "LinkedIn", href: p.linkedin },
    p.github   && { label: "GitHub",   href: p.github }
  ].filter(Boolean);
  return (
    <>
      <View style={{ marginHorizontal: -space[4] }}>
        {rows.map(r => (
          <Pressable key={r.label} accessibilityRole="link" accessibilityLabel={`${r.label}: ${r.value}`}
                     onPress={() => open(r.href)}
                     style={({ pressed }) => ({
                       flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 48,
                       paddingVertical: space[3], paddingHorizontal: space[4], borderRadius: radius.sm,
                       backgroundColor: pressed ? c.surfaceSunken : "transparent"
                     })}>
            <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: c.brandSoft,
                           alignItems: "center", justifyContent: "center" }}>
              <Icon name={r.icon} color={c.brand} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[type.caption, { color: c.inkMuted }]}>{r.label}</Text>
              <Text numberOfLines={1} style={[type.body, { color: c.ink }]}>{r.value}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      {social.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], marginTop: space[3] }}>
          {social.map(s => (
            <Button key={s.label} variant="secondary" label={s.label} onPress={() => open(s.href)}
                    style={{ paddingHorizontal: space[4] }} />
          ))}
        </View>
      )}
    </>
  );
}

// Kartı Kaydet: .vcf dosyası paylaşım menüsüyle açılır.
// Rehber izni (contacts) istenmez; kişi kaydı telefonun kendi uygulamasında yapılır.
function SaveCard({ profile: p, onStatus }) {
  const { c } = useTheme();
  const [saveLabel, setSaveLabel] = useState("Kartı Kaydet");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaveLabel("Kaydediliyor…");
    let result;
    try {
      const file = new File(Paths.cache, `${fullNameOf(p).replace(/\s+/g, "_")}.vcf`);
      file.create({ overwrite: true });
      file.write(buildVCard(p));
      await Sharing.shareAsync(file.uri, { mimeType: "text/vcard", UTI: "public.vcard", dialogTitle: "Kartı Kaydet" });
      result = "Kart kaydedildi";
    } catch (e) {
      result = "Hata: kaydedilemedi. Tekrar deneyin.";
    }
    setSaving(false);
    setSaveLabel(result);
    onStatus(result);
    setTimeout(() => setSaveLabel("Kartı Kaydet"), 2000);
  }

  return (
    <View style={{ marginTop: space[6] }}>
      <SectionTitle center>Kartviziti telefonunuza ekleyin</SectionTitle>
      <Text style={[type.caption, { color: c.inkMuted, textAlign: "center", marginBottom: space[3] }]}>
        Kartvizitimi rehberinize ekleyin. Yukarıdaki formu da doldurduysanız size ayrıca ulaşabilirim.
      </Text>
      <Button icon="save" label={saveLabel} disabled={saving} onPress={handleSave} />
    </View>
  );
}

function QrCode({ url }) {
  const { c } = useTheme();
  const cells = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    const n = qr.getModuleCount(), out = [];
    for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (qr.isDark(r, col)) out.push(`M${col} ${r}h1v1h-1z`);
    return { n, d: out.join("") };
  }, [url]);
  return (
    <View style={{ marginTop: space[6], alignItems: "center", gap: space[3] }}>
      <View accessible accessibilityRole="image" accessibilityLabel={`QR kod: ${url}`}>
        <Svg width={128} height={128} viewBox={`-2 -2 ${cells.n + 4} ${cells.n + 4}`} shapeRendering="crispEdges">
          <Path d={cells.d} fill={c.ink} />
        </Svg>
      </View>
      <Text style={[type.caption, { color: c.inkMuted }]}>Telefonla tarayın: {stripProto(url)}</Text>
    </View>
  );
}

function Projects({ projects }) {
  const { c } = useTheme();
  if (!projects || !projects.length) return null;
  return (
    <View style={{ marginTop: space[6] }}>
      <SectionTitle>Projelerim</SectionTitle>
      <View style={{ gap: space[3] }}>
        {projects.map(pr => (
          <View key={pr.name} style={{ borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: space[4] }}>
            <Text style={[type.body, { fontFamily: "PlusJakartaSans_600SemiBold", color: c.ink, marginBottom: space[1] }]}>{pr.name}</Text>
            <Text style={{ fontFamily: "PlusJakartaSans_400Regular", fontSize: 14, lineHeight: 20, color: c.inkMuted, marginBottom: space[3] }}>{pr.text}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[1] }}>
              {pr.tags.map(t => <Chip key={t} label={t} />)}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProfileCard({ profile: p, onStatus }) {
  const { c, shadowCard } = useTheme();
  return (
    <View style={[{ width: "100%", maxWidth: 360, backgroundColor: c.surfaceRaised, borderRadius: radius.lg, padding: space[6] }, shadowCard]}>
      <View style={{ alignItems: "flex-start", gap: space[3] }}>
        <Avatar firstName={p.firstName} lastName={p.lastName} photo={p.photo} />
        <View>
          <Text accessibilityRole="header" style={[type.cardName, { color: c.ink }]}>{fullNameOf(p)}</Text>
          <Text style={[type.role, { color: c.inkMuted }]}>{[p.title, p.company].filter(Boolean).join(" · ")}</Text>
        </View>
        {!!p.bio && <Text style={[type.body, { color: c.inkMuted }]}>{p.bio}</Text>}
      </View>

      <Divider />
      <ContactList profile={p} />

      <Divider />
      <MeetingForm profile={p} onStatus={onStatus} />

      <Divider />
      <SaveCard profile={p} onStatus={onStatus} />

      <Divider />
      <QrCode url={p.cardUrl} />

      <Divider />
      <Projects projects={p.projects} />
    </View>
  );
}
