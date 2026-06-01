---
name: motion-concept
description: Generates creative motion and interaction design concepts for websites. Use this skill when a visual direction needs dynamic, interactive, or animation design thinking — whether standalone or as part of a Visual Explorer or UX Designer session. Trigger when someone says "how should the site move", "I want scroll animations", "help me think through the interactions", "我想做一些有创意的动态效果", "网站能不能有沉浸式体验", or when visual-explorer requests it.
---

# Motion Concept Skill

Take a website's type, key pages, style direction, and audience — and generate **concrete, cinematography-level motion and interaction concepts** across six design dimensions.

We are designing for an **Awwwards / Magazine-level** aesthetic. Motion here is not simple "fade-in UI elements." It is the pacing, physical weight, and spatial cinematography of the experience. Good motion design makes a site feel alive, purposeful, and expensive. Bad motion design is noise.

The goal here is *concept* — not code. You're giving a creative director and developer enough direction to feel excited and clear about what to build.

---

## Input You Need

Before generating, you need (at minimum):
- **Site type and industry** — automotive? SaaS? fashion? portfolio?
- **Key pages** — which pages carry the most interaction weight?
- **Style direction** — what's the overall visual feeling? (Minimal, brutalist, immersive, editorial…)

Optional but helpful:
- Existing motion references (sites or products they admire)
- Target audience
- Any specific interaction ideas the user has mentioned

---

## The Six Cinematography Dimensions

For each website, evaluate and generate concepts across **all seven** of the following:

---

### 1. 🎬 Scroll Storytelling (The Timeline)

**What it is**: Content, video, or scenes that progress as the user scrolls. The page becomes a timeline. The scrollbar acts as a film scrubber.
**Examples of this pattern**:
- Automotive site: scrolling through the exterior 360° view, then into the interior, then the cockpit
- Fashion: a lookbook where each scroll advances to the next look, with a fabric-texture liquid transition
- Storytelling: WebGL distortion or 3D transformations that unfold based on scroll velocity
**What to consider**:
- What is the beginning, middle, and end?
- Is it video-driven (synced playback) or DOM-driven?
**Output format**: Describe the scroll story as a scene-by-scene sequence.

---

### 2. 🖱️ Cursor Choreography & Physics

**What it is**: The cursor becomes part of the composition. Introduce physical mass. Does the cursor act as a flashlight, a magnetic attractor with high inertia, or a water rippler over WebGL shaders?
**Examples of this pattern**:
- Hovering over a product image makes layers shift at different speeds, creating fake depth
- A "spotlight" cursor reveals hidden text beneath a dark overlay
- CTA buttons that magnetically pull the cursor when it gets within 80px, with spring tension
**What to consider**:
- Desktop-only — mobile users won't experience this. Is there a touch equivalent?
- Overuse is tiring — this is a signature moment, not background behavior.
**Output format**: Name the cursor effect, describe the trigger zone, and describe the physical mass and visual response.

---

### 3. 🎭 Cinematic Transitions

**What it is**: The animation *between* states — page to page, section to section. No simple fades. Think spatial cinematography.
**Examples of this pattern**:
- Clicking a card: the camera zooms through the eye of a photo into the next layout (non-linear, cinematic).
- Navigating pages: liquid displacement wiping the screen.
- Hovering a nav item: a highly stylized, inverted masking effect reveals an alternate layer of the layout.
**What to consider**:
- Easing is everything: explicitly define the exact cubic-bezier curve required. E.g., `cubic-bezier(0.85, 0, 0.15, 1)` for a snappy editorial slide, or `cubic-bezier(0.16, 1, 0.3, 1)` for heavy smooth drag.
**Output format**: For each key transition, describe: trigger → spatial animation → frontend math (cubic-bezier).

---

### 4. 🌊 Ambient Texture & WebGL

**What it is**: Background or environmental animation that plays continuously. It sets the baseline emotional temperature.
**Examples of this pattern**:
- 30% opacity high-frequency film grain + slow breathing color gradient
- Slowly rotating 3D monolithic geometry with shifting light angles
- A mesh or fabric texture that breathes in and out at 0.3s intervals
**What to consider**:
- Must be subtle enough that it doesn't distract from content.
**Output format**: Describe the environmental condition and its emotional function.

---

### 5. ✨ Micro-Interaction Rituals

**What it is**: The brutalist snap of a hover state or the heavy spring physics of a button. Define the exact feeling of the interaction.
**Examples of this pattern**:
- Button hover: magnetic physics pull the button toward the cursor with heavy inertia.
- Navigation hover: brutalist, instantaneous color inversion with zero transition time (0ms mechanical snap) to create a sharp feel.
- Form submit: the submit button breaks apart into particles.
**What to consider**:
- Speed matters: interaction feedback should be either near-instant for mechanical feels, or use heavy damping for luxury feels.
**Output format**: Component type → hover/active/focus state → extreme physics description.

---

### 6. 🔊 Sound Design & Auditory Feedback

**What it is**: The sonic layer of the experience — UI sound effects for key interactions and ambient background soundscapes that reinforce the emotional tone.
**Examples of this pattern**:
- Button hover: a deep, sub-bass heartbeat thump
- Page transition: a crisp glass-shatter chime
- Modal open: a subtle air-pressure release
- Ambient: low-frequency drone that shifts with scroll depth
**What to consider**:
- Sound is synesthetic — it must pair with the motion concept, not fight it.
- Always provide a "silent" alternative or note that sound is desktop/permission-gated.
**Output format**: For each key interaction moment, describe: trigger → sound concept → emotional function.

---

### 7. 🌌 Immersive Background Assets (The Core)

**What it is**: High-end websites rely on breathtaking, cinematic background imagery or video to establish mood before a single word is read. This is what separates a template from a premium brand experience.
**Examples of this pattern**:
- A.I. Startup: A generative, bioluminescent neural network acting as a glass-morphism backing layer.
**What to consider**:
- Provide explicit, highly artistic AI prompts for them to generate these backgrounds (e.g., using Midjourney for images, Runway/Luma for video).
**Output format**: Describe the concept, provide the AI Prompt, and an Integration Guide.

---

## Output Structure

After evaluating all seven dimensions, produce:

```markdown
## Cinematography & Motion Concepts for [Site Name]

### Approach Philosophy
[2-3 sentences: What is the physical weight and spatial rules of this site? Is it theatrical? Precise? Organic? Why?]

---

### 1. Scroll Storytelling (Timeline)
**Recommended**: [Yes/No - why]
[If yes: describe the scene sequence]

### 2. Cursor Physics
**Recommended**: [Yes/No]
[If yes: describe the mass, delay, and effect]

### 3. Cinematic Transitions & Math
**Recommended**: [Yes]
[Describe 2 key transitions.]
**Frontend Math**: [Define the exact cubic-bezier curve required]

### 4. Ambient Texture & WebGL
**Recommended**: [Yes/No]
[Describe the environmental condition]

### 5. Micro-Interaction Rituals
**Recommended**: [Yes]
[Describe hover/click states, emphasizing extreme speed or extreme physics.]

### 6. Sound Design & Auditory Feedback
**Recommended**: [Yes/No]
[Describe UI sound concepts and ambient soundscapes for key interactions.]

### 7. Immersive Background Assets (The Core)
**Recommended**: [Yes]
**Concept**: [Describe the visual scene]
**AI Generation Prompt (Image/Video)**: `[Highly detailed prompt for Gen-3 / Midjourney v6]`
**Integration Guide**: [E.g., 'Fixed background, mix-blend-mode: exclusion']

---

### Priority & Complexity

| Concept | Impact | Complexity | Priority |
|---|---|---|---|
| [Scroll Storytelling] | High | High | Build first |
| [Cinematic Transitions] | High | Medium | Build first |
| [Micro-Interaction Rituals] | Medium | Low | Build first |
| [Sound Design] | Medium | Low | Build first |
| [Ambient Texture] | Medium | Medium | Build second |
| [Cursor Physics] | Low-Medium | Medium | Build second |
| [Immersive Backgrounds] | Highest | Medium | Critical Asset |
```

---

## A Note on Restraint

Not every pattern belongs on every site. A healthcare booking platform does not need scroll-driven video storytelling. A luxury automobile brand does. Be honest: if it doesn't serve this site's users or purpose, say so and explain why.
