Full-width buttons for the card's two actions: **Kartı Kaydet** (primary, downloads the vCard) and **Toplantı Talep Et** (secondary, opens the meeting request).

**The consumer provides:** the label, an optional leading icon, and the click handler (the webhook call that starts the n8n flow).

**Variants**
- `bc-btn-primary` — `brand` fill, `on-brand` text. One per screen: saving the card is the main job.
- `bc-btn-secondary` — `line-strong` outline, `ink` text, a small `accent` dot that marks the meeting action.
- `bc-btn-accent` — `accent` fill, `on-accent` text. Only inside the meeting flow (time picker confirm).
- Disabled / loading: `disabled` attribute, label changes to the in-progress verb ("Kaydediliyor…").

**Don't** put two primaries side by side, or use `accent` for anything that isn't about meetings.
