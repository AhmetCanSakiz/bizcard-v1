---
name: bizcard-design-system
description: BizCard brand and UI design system (colors, type, spacing, components, icons, Turkish copy rules). Use whenever building or changing any BizCard screen, page, component or marketing visual, in web, React, React Native or Power Apps.
---

# BizCard design system

BizCard is a one-screen digital business card opened from a QR code or link. Its job: show who this
person is in two seconds and let the visitor save the contact in one tap.

## Read first

1. `BRAND.md`: the brand book (principles, voice, color, type, spacing, icons, accessibility). Follow it.
2. `components/<Name>.md`: guidelines for the component you are building.
3. `examples/<Name>.html`: working markup for that component. Copy its structure and class names.

## Files

| File | Use |
| --- | --- |
| `tokens.css` | CSS variables for every token, light + dark, plus the Google Fonts import and `.text-*` type classes. Load first. |
| `bizcard.css` | Component classes (`bc-card`, `bc-row`, `bc-btn-*`, `bc-chip`…). Load after `tokens.css`. |
| `tokens.json` | Source of truth for tokens; use it to generate Tailwind, React Native or Power Apps themes. |
| `icons/*.svg` | phone, mail, globe, map-pin, calendar, save, qr. `stroke="currentColor"`; inline them. |
| `examples/*.html` | Standalone previews; open in a browser to check. |

## Hard rules

- Use tokens only (`var(--brand)`, `var(--space-4)`); never hard-code hex, px spacing or white.
- Name in Fraunces (`card-name`, 32/36, 600); everything else Plus Jakarta Sans.
- `brand` (teal) is the only strong color. `accent` (amber) means "meeting" and nothing else, as a fill with `on-accent` text.
- Max two buttons on the card: primary "Kartı Kaydet", secondary "Toplantı Talep Et".
- Card: max 360px, `radius-lg`, `shadow-card`, `space-6` padding. Only the card has a shadow.
- Touch targets ≥ 48px; 2px `focus` ring with 2px offset on every interactive element.
- UI copy in Turkish, sentence case, "siz" form, no emoji. Respect İ/i and I/ı.
- No logo exists yet: write "BizCard" in Plus Jakarta Sans 700 in `ink`. Never draw a mark.
- Dark mode: tokens flip automatically; `<html data-theme="dark">` or `"light"` forces a theme.

## Other platforms

For Tailwind, React Native or Power Apps, generate the theme from `tokens.json` (color tokens have
`light` and `dark` values; `focus` is an alias of `brand`). Keep token names as they are.
