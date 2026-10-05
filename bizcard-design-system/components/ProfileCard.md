The digital business card itself: avatar, name, role, scan counter, contact rows and the two actions, in that order.

**The consumer provides:** name, job title, company, an optional photo (falls back to two initials), 2–5 contact rows, and the handlers for the two action buttons.

**Structure (top to bottom):** `.bc-avatar` → `.bc-name` (`card-name`) → `.bc-role` (`role`, `ink-muted`) → `.bc-chip` scan counter (owner view only) → `.bc-divider` → `.bc-list` of ContactRow → `.bc-actions` (primary then secondary).

**Do**
- Keep the card at most 360px wide, centred, with `space-4` side gutters on phones and `space-8` above it.
- Use `surface-raised` + `shadow-card` + `radius-lg`; the card is the only element with a shadow.
- Hide the scan counter on the public view — visitors never see it.

**Don't**
- Don't add a cover image or gradient behind the name; the teal avatar ring is the only colour in the header.
- Don't show more than two buttons. A third action goes into the share sheet.
