# AI Video Generation Guide

How we generate realistic service videos for landing page hero sections.

---

## Service Used

**Replit AI Media Generation — `generateVideo` / `generateVideoAsync`**

Built-in to the Replit agent sandbox. No external API key needed. Powered by Google Veo under the hood. Videos are saved to `attached_assets/generated_videos/` and must be manually copied to the serving folder (e.g. `artifacts/mockup-sandbox/public/videos/`).

---

## When to Use Async vs Sync

| Function | Use when |
|---|---|
| `generateVideoAsync` | Generating 2+ videos — fire all in parallel, then `wait_for_background_tasks` |
| `generateVideo` | Only generating 1 video and need it before writing any code |

Always prefer async + parallel when generating multiple clips — it cuts total wait time from ~5min to ~2min.

---

## Parameters That Matter

```js
await generateVideoAsync({
  prompt:           "...",          // Main description — most important
  summary:          "bella-botox",  // Sets the output filename
  aspectRatio:      "16:9",         // Always 16:9 for hero backgrounds
  resolution:       "720p",         // 720p is fine for web; 1080p if exporting
  durationSeconds:  6,              // 4 / 6 / 8 — 6s is the sweet spot for heroes
  personGeneration: "allow_adult",  // REQUIRED to show human faces
  negativePrompt:   "...",          // Optional — useful to block dark/blurry results
})
```

**`personGeneration: "allow_adult"` is mandatory** if you need human faces visible. Without it, people are excluded.

---

## Prompt Formula That Works

The prompts that produced good BellaDerma results followed this structure:

```
[Subject / person receiving treatment] in [setting description].
[What the practitioner is doing, describing hands/tools in detail].
[Lighting description — always specify BRIGHT].
[Quality tags].
```

### Proven Prompt Template

```
[Close-up / Wide shot] of [beautiful/professional] [person description]
[receiving/performing] [treatment name] in a [bright / modern / luxury] [clinic/spa/studio].
[Describe the action: gloved hands, specific tool, motion].
[Lighting: bright natural light / soft daylight / clinical white lighting].
[Background: clean white / soft blur / clinic interior].
[Quality: real human face clearly visible, ultra HD, cinematic, professional].
```

---

## The Three BellaDerma Videos

These are the exact prompts used. Copy and adapt for similar clinics.

### Video 1 — Laser Hair Removal (`bella-laser-hair.mp4`)
```
Close-up of a professional female aesthetician performing laser hair removal
on a woman's smooth leg in a bright modern beauty clinic. Blue gloved hands
hold a white medical laser handpiece moving gently over tanned skin. Bright
white clinical lighting, clean white background, ultra HD, cinematic, real
human faces visible, professional medical aesthetic setting.
```
- `durationSeconds: 6` · `personGeneration: "allow_adult"` · `resolution: "720p"`

### Video 2 — Botox / Facial Treatment (`bella-botox-facial.mp4`)
```
Beautiful young woman lying on a treatment bed in a bright luxury beauty
clinic, receiving a facial botox injection. A female doctor in white coat
with blue gloves gently injects into her smooth cheek. Bright natural light,
soft white decor, warm clinical atmosphere, real human face clearly visible,
ultra HD cinematic.
```
- `durationSeconds: 6` · `personGeneration: "allow_adult"` · `resolution: "720p"`

### Video 3 — PRP / Hyaluronic Filler (`bella-prp-filler.mp4`)
```
Close-up of a young woman with glowing healthy skin receiving a hyaluronic
acid filler injection near her lips in a bright modern dermatology clinic.
Pink gloved hands of an aesthetician hold a thin syringe. Soft daylight,
clean white background, professional medical setting, real human face visible,
cinematic slow motion, ultra HD.
```
- `durationSeconds: 6` · `personGeneration: "allow_adult"` · `resolution: "720p"`

---

## Quality Tips

| Goal | What to add to the prompt |
|---|---|
| Bright / not dark | `"bright natural light"`, `"soft daylight"`, `"well-lit clinic"` |
| Human faces visible | `"real human face clearly visible"`, `"personGeneration: allow_adult"` |
| Cinematic feel | `"cinematic"`, `"slow motion"`, `"ultra HD"` |
| Clinical / medical | `"blue/pink gloved hands"`, `"white coat"`, `"medical device"` |
| Luxury / spa | `"luxury beauty clinic"`, `"marble interior"`, `"soft warm lighting"` |
| Avoid dark frames | Add `negativePrompt: "dark, dim, moody, shadowy, low light"` |
| Avoid blurry | Add `negativePrompt: "blurry, out of focus, overexposed"` |

**Never describe the scene as dark, moody, dramatic, or night.** AI models default to cinematic dark tones if you don't explicitly specify bright.

---

## Workflow — Generating Videos for a New Client

```js
// Step 1: Fire all async in parallel
const v1 = await generateVideoAsync({ prompt: "...", summary: "client-service1", ... });
const v2 = await generateVideoAsync({ prompt: "...", summary: "client-service2", ... });
const v3 = await generateVideoAsync({ prompt: "...", summary: "client-service3", ... });

// Step 2: Wait for all to finish (~90–150 seconds)
await wait_for_background_tasks({ wait_mode: "all" });

// Step 3: Copy to mockup public folder
// cp attached_assets/generated_videos/client-service1.mp4 artifacts/mockup-sandbox/public/videos/
```

---

## How Videos Are Used in Hero Components

### The Crossfade Pattern (3-scene, 24s cycle)

Used in `BellaDermaA.tsx` and `BellaDermaB.tsx`. Mirrors the GrowthMonk `HeroK` pattern.

```css
/* Each video gets its own keyframe — all start at t=0, keyframes handle timing */
@keyframes cfVid1 {
  0%  { opacity: 1 }   29% { opacity: 1 }   33% { opacity: 0 }
  96% { opacity: 0 }  100% { opacity: 1 }
}
@keyframes cfVid2 {
  0%  { opacity: 0 }   29% { opacity: 0 }   33% { opacity: 1 }
  62% { opacity: 1 }   67% { opacity: 0 }  100% { opacity: 0 }
}
@keyframes cfVid3 {
  0%  { opacity: 0 }   62% { opacity: 0 }   67% { opacity: 1 }
  96% { opacity: 1 }  100% { opacity: 0 }
}
.vid1 { animation: cfVid1 24s ease-in-out infinite; }
.vid2 { animation: cfVid2 24s ease-in-out infinite; opacity: 0; }
.vid3 { animation: cfVid3 24s ease-in-out infinite; opacity: 0; }
```

```tsx
{/* All videos stacked, z=0, crossfade via CSS — NO animation-delay */}
<div style={{ position:"absolute", inset:0, zIndex:0 }}>
  <video autoPlay muted loop playsInline className="vid1"
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
    <source src="/__mockup/videos/service1.mp4" type="video/mp4" />
  </video>
  <video autoPlay muted loop playsInline className="vid2"
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0 }}>
    <source src="/__mockup/videos/service2.mp4" type="video/mp4" />
  </video>
  <video autoPlay muted loop playsInline className="vid3"
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0 }}>
    <source src="/__mockup/videos/service3.mp4" type="video/mp4" />
  </video>
</div>
```

### Critical Rules

- **Never use `animation-delay`** — the keyframes already offset each scene within the cycle. Adding delay breaks the timing completely.
- **Never use `mixBlendMode: "luminosity"` on a bright background** — luminosity blend only works on dark backgrounds (like HeroK's `#030712`). On white/cream it makes videos invisible.
- **Always use `<source>` inside `<video>`**, not a bare `src` attribute.
- **Always include `muted`** — browsers block autoplay of unmuted video.
- Text transitions use identical keyframes on separate `<div>` layers so service labels/descriptions swap in sync with each video scene.

---

## Files Reference

| File | Purpose |
|---|---|
| `artifacts/mockup-sandbox/public/videos/bella-laser-hair.mp4` | Laser hair removal scene |
| `artifacts/mockup-sandbox/public/videos/bella-botox-facial.mp4` | Botox / facial treatment scene |
| `artifacts/mockup-sandbox/public/videos/bella-prp-filler.mp4` | PRP / hyaluronic filler scene |
| `artifacts/mockup-sandbox/src/components/mockups/laser-heroes/BellaDermaA.tsx` | Option A — Clinical Blue hero |
| `artifacts/mockup-sandbox/src/components/mockups/laser-heroes/BellaDermaB.tsx` | Option B — Warm Rose-Gold hero |
| `artifacts/mockup-sandbox/src/components/mockups/growthmonk-landing/HeroK.tsx` | Reference: dark multi-scene crossfade |
