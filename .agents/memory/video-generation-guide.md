---
name: Video generation guide
description: How to generate realistic clinic/beauty service videos — service, prompts, params, CSS hero pattern, and common mistakes.
---

## Rule
When asked to generate service videos for any client (clinic, spa, beauty, care), read `docs/video-generation-guide.md` first — it has the proven prompt formula, exact BellaDerma examples to adapt from, parameter settings, and the crossfade CSS pattern.

**Why:** Getting bright human-face video requires specific prompt wording and `personGeneration: "allow_adult"`. Without this reference, dark/faceless/unusable clips are generated and time is wasted on retries.

**How to apply:**
1. User asks for landing page videos / hero videos / service clips → open `docs/video-generation-guide.md`
2. Copy the prompt template from the guide, substitute client treatment + setting
3. Always run multiple clips in parallel with `generateVideoAsync` + `wait_for_background_tasks`
4. Copy output from `attached_assets/generated_videos/` to `artifacts/mockup-sandbox/public/videos/`
5. Use the crossfade CSS pattern from the guide — never add `animation-delay`, never use `mixBlendMode: luminosity` on bright backgrounds
