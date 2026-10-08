export const fullNameOf = p => `${p.firstName} ${p.lastName}`;
export const stripProto = url => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
export const pad = n => String(n).padStart(2, "0");
export const isoOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => isoOf(new Date());

// vCard (rehbere kaydetmek için)
const esc = s => String(s).replace(/([\\,;])/g, "\\$1");
export function buildVCard(p) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(p.lastName)};${esc(p.firstName)};;;`,
    `FN:${esc(fullNameOf(p))}`,
    `ORG:${esc(p.company)}`,
    `TITLE:${esc(p.title)}`,
    `TEL;TYPE=CELL:${p.phone}`,
    `EMAIL:${p.email}`,
    `URL:${p.website}`,
    p.linkedin && `URL;TYPE=LinkedIn:${p.linkedin}`,
    p.github && `URL;TYPE=GitHub:${p.github}`,
    p.location && `ADR:;;;${esc(p.location)};;;`,
    "END:VCARD"
  ].filter(Boolean).join("\r\n");
}

// Saat seçenekleri: 09:00 - 18:00, 30 dakikada bir
export const TIME_SLOTS = [];
for (let h = 9; h < 18; h++) TIME_SLOTS.push(`${pad(h)}:00`, `${pad(h)}:30`);

export const SLOT_MINUTES = 30;
export const DAYS_AHEAD = 14;

// Bugünden başlayarak seçilebilir günler
export function upcomingDays() {
  const out = [];
  const d = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    out.push(isoOf(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

// "2026-10-05T14:30:00+03:00" biçiminde, ziyaretçinin saat dilimiyle
function toLocalISO(d) {
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const a = Math.abs(off);
  return `${isoOf(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

// Webhook gövdesi — şema: ../meeting-webhook.schema.json
export function buildMeetingPayload(form, p, dateText) {
  const start = new Date(`${form.date}T${form.time}`);
  const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
  return {
    type: "meeting_request",
    version: 1,
    submittedAt: new Date().toISOString(),
    contact: {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null
    },
    topic: form.topic.trim(),
    meeting: {
      date: form.date,
      time: form.time,
      start: toLocalISO(start),
      end: toLocalISO(end),
      durationMinutes: SLOT_MINUTES,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      displayText: `${dateText}, ${form.time}`
    },
    kvkkNoticeRead: form.consent,
    recipient: { name: fullNameOf(p), email: p.email },
    source: { page: p.cardUrl }
  };
}
