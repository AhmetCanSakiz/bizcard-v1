BizCard is a digital business card: one screen, one person, opened from a QR code or a link on a phone. The design has one job — let a stranger understand who this is in two seconds and save the contact in one tap. Everything below serves that.

## Principles

1. **The name is the hero.** The person's name in `card-name` is the largest thing on screen. Nothing competes with it: no cover photos, no gradients, no logos above it.
2. **One tap to save.** "Kartı Kaydet" is always the primary button, always visible without scrolling on a 375px-wide phone.
3. **Calm, not corporate.** Warm paper background, soft 24px card corners, one teal. It should feel like a well-printed card, not a dashboard.
4. **Same card everywhere.** Web, iOS and Android render the same card with the same tokens; only platform chrome changes.

## Content and voice

- Interface copy is Turkish, short and warm; address the visitor as **siz**. Buttons are verb phrases: "Kartı Kaydet", "Toplantı Talep Et", "Paylaş".
- Sentence case everywhere ("İletişim bilgileri", not "İLETİŞİM BİLGİLERİ"). Respect Turkish casing: İ/i and I/ı.
- Labels are one word: Telefon, E-posta, Web, Konum.
- In-progress states use the present continuous: "Kaydediliyor…", "Gönderiliyor…". Success: "Kart kaydedildi". Errors say what to do: "Bağlantı kurulamadı. Tekrar deneyin."
- No emoji in the interface.

## Colour

- Page ground is `surface`; the card is `surface-raised` with `shadow-card`. In dark mode the same tokens flip — never hard-code white.
- `brand` (BizCard teal) is the only strong colour: primary button fill, contact icons, links, the focus ring. Text on a brand fill is `on-brand` (white in light, dark ink in dark).
- `accent` (amber) means **meeting** and nothing else: the dot on "Toplantı Talep Et" and the confirm button in the meeting flow. Use it as a fill with `on-accent` text; never as text on the page.
- Text: `ink` for names, values and body; `ink-muted` for role, labels and captions. Both pass 5.5:1 or better on every surface in both themes.
- `line` is decorative (the divider). Anything that must be seen as an edge — a secondary button, an input — uses `line-strong`.
- Errors use `danger` plus the word "Hata" or an icon, never colour alone.

## Typography

- The name is set in **Fraunces** (`card-name`, 32/36, 600) — the one serif moment that makes the card feel personal.
- Everything else is **Plus Jakarta Sans**: `role` for title and company, `body` for contact values, `label` for buttons, `caption` for small print and the scan counter, `title` for screens outside the card.
- Both faces come from Google Fonts and cover Turkish characters (ç, ğ, ı, İ, ö, ş, ü). Check a real Turkish name when you change a face.
- Long names wrap to two lines; never shrink `card-name` below 28px to fit.

## Space, shape, elevation

- 4px base: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-6` 24 · `space-8` 32.
- The card: max 360px wide, `space-6` padding, `radius-lg` (24px), `space-8` from the top, `space-4` side gutters on phones.
- Buttons use `radius-md` (12px) and are 48px tall, full width, stacked with `space-2` between them.
- Contact rows use `radius-sm` (8px) and are at least 48px tall — the whole row is the touch target.
- Only the card has a shadow (`shadow-card`). Everything inside it is flat.

## Iconography

- The Icons group: phone, mail, globe, map-pin, calendar, save, qr. Line style, 24px grid, 1.75px stroke, rounded.
- Inline the SVG with `stroke="currentColor"`; in contact rows show it at 20px in a 36px `brand-soft` tile tinted `brand`.
- Don't use social-network logos. Show a globe icon with the network's name as the label.

## Interaction and accessibility

- Every interactive element gets a 2px solid `focus` ring with 2px offset.
- Touch targets are at least 48 × 48px.
- Hover/pressed on contact rows: `surface-sunken` background. Buttons don't change colour on hover; they show a pressed state only.
- Motion is limited to a 150ms fade on state changes; respect `prefers-reduced-motion`.

## Logo

There is no BizCard logo yet. Until one exists, write "BizCard" in Plus Jakarta Sans 700 in `ink` wherever the product name appears (footer, app store listing), and never draw a mark.
