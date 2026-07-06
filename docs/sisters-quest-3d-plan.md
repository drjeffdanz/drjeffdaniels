# Sisters' Quest 3D — Game Plan

*A 3D adventure game in the tradition of Sierra's King's Quest, built on the world of
"Sisters' Quest: The Moonveil Crown."*

**Status:** Planning
**Last updated:** 2026-07-06

---

## 1. Vision

A browser-playable 3D adventure game with the soul of classic King's Quest: a painterly
fairy-tale kingdom explored room by room, puzzles solved with wit and inventory items,
characters worth talking to, and death used sparingly (or not at all). Modern reference
points: *King's Quest (2015)*, *Grim Fandango Remastered*, and the fixed-camera charm of
early 3D adventures — not the open-world combat of *KQ8: Mask of Eternity*.

Rather than inventing a new world, this project is a **3D reimagining of Sisters' Quest**,
the 2D point-and-click already live on this site. That gives us, on day one:

- A complete story (8 acts), cast, and dialogue script
- 16 painted backgrounds that become 3D art direction / concept art
- A full soundtrack (6 tracks in `public/sisters-quest/assets/music/`)
- Proven game systems to port: `GameState`, `VerbSystem`, `DialogueSystem`, `MusicManager`
- Character portraits and sprites as modeling reference

### A note on IP

King's Quest is Activision Blizzard's property. We take **inspiration** — tone, structure,
puzzle design, fairy-tale sensibility — but use no Sierra names, characters, locations, or
assets. Sisters' Quest already does exactly this (Cresthollow instead of Daventry, the
Moonveil Crown instead of the Crown of Daventry), so building on it keeps us clean.

---

## 2. Core design pillars

1. **Rooms, not open world.** The game is a connected set of hand-composed 3D scenes,
   each framed like a painting — the 3D descendant of a Sierra "screen."
2. **Look / Talk / Take / Use, evolved.** The 2D verb system becomes context-sensitive
   3D interaction: hover a hotspot, get the applicable verbs. Same data model underneath.
3. **Story first, tech second.** Every technical choice is judged by whether it gets
   Act 1 playable in 3D sooner.
4. **No dead ends, gentle deaths.** Modern adventure sensibility: you can't render the
   game unwinnable; failure is a scene, not a save-reload.
5. **Ships on the website.** Like `sisters-quest` and `attention-matrix`, the game builds
   to static files served from `public/`, playable at drjeffdaniels.com on desktop and
   (stretch goal) tablet.

---

## 3. Key decisions

### 3.1 Engine: Three.js via React Three Fiber (recommended)

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **React Three Fiber (Three.js)** | Matches existing React/TypeScript/Next.js skills; tiny static output; UI (dialogue, inventory) in plain React; huge ecosystem (drei, rapier) | You build engine-ish glue yourself (navmesh, triggers) | ✅ **Recommended** |
| Godot 4 (HTML5 export) | Real editor, animation tools, navmesh built in | ~30–40 MB WASM payload; new toolchain to learn; clunkier web embeds | Fallback if R3F glue gets painful |
| Unity / Unreal | Industry standard | Heavy web builds, licensing, massive overkill for a room-based adventure | ❌ |

R3F specifically because dialogue boxes, verb UI, inventory, and menus are ordinary React
components layered over the canvas — we rewrite almost none of that thinking, and some of
the 2D game's data files (`dialogues.js`, `items.js`) port with light editing.

**Supporting libraries:** `@react-three/drei` (controls, loaders, helpers),
`three-pathfinding` (click-to-move on a navmesh), `zustand` (game state),
`@react-three/postprocessing` (bloom/vignette for the painterly look). Physics engine
likely unnecessary — adventure games need triggers and raycasts, not rigid bodies.

### 3.2 Camera & controls: fixed cinematic cameras + click/tap-to-move (recommended)

- Each room has one or more **hand-placed cameras** that frame the scene like the 2D
  backgrounds (the existing JPGs literally become the camera-composition spec).
- Player **clicks the ground to walk** (raycast → navmesh path), clicks hotspots to
  interact — identical mental model to the 2D game, so puzzles port unchanged.
- Optional WASD as a secondary input, but pointer-first keeps it true to the genre and
  makes tablet support cheap.
- Alternative considered and rejected for v1: free third-person camera (KQ8 style) —
  doubles art cost because every angle must look good, and invites combat-shaped design
  we don't want.

### 3.3 Art style: stylized low-poly with painterly lighting

- **Low-poly, hand-painted-adjacent** (think *A Short Hike* / *RiME*-lite): flat or
  gradient-ramped materials, strong color scripting per room, fog and rim light doing the
  atmospheric work the 2D paintings do now.
- This style is achievable by a small team / solo dev, compresses well for web, and ages
  gracefully — photorealism would fail on all three counts.
- **Pipeline:** Blender → glTF (.glb) with Draco/meshopt compression. Character rigs and
  walk/idle/talk animations via **Mixamo** on low-poly humanoids.
- **Kickstart assets:** CC0 packs from Kenney, Quaternius, and Poly Pizza for props and
  gray-box dressing; replace hero assets (the sisters, the Queen, key set pieces) with
  custom models over time.
- Existing 2D assets reused directly: music, character portraits in dialogue UI, and
  backgrounds as skybox/matte-painting elements where a room looks out over the world.

### 3.4 Scope: Act 1 is the game (for now)

The 2D game has 8 acts. In 3D, **Act 1 alone is a serious project.** The plan treats
Act 1 as the shippable product ("Sisters' Quest 3D: Chapter One") with the architecture
ready for later acts. Estimated room count for Act 1: **4–5 rooms** (Queen's Chamber,
Great Hall, Palace Library, Cresthollow, Thornwood edge).

---

## 4. Systems design (porting map)

| 2D system | 3D equivalent | Effort |
|---|---|---|
| `GameState.js` (inventory, flags, localStorage save) | `zustand` store + `persist` middleware — near-mechanical port | Low |
| `VerbSystem.js` (look/talk/take/use) | Hotspot components: raycast hover → verb ring / context menu; same verb keys so puzzle logic ports | Low-Med |
| `DialogueSystem.js` + `dialogues.js` | React dialogue overlay; **dialogue data files reused as-is** (same `{speaker, text}` shape); portraits reused | Low |
| `MusicManager.js` | Howler.js or plain `<audio>` with crossfade; same MP3s | Low |
| Phaser scenes (one class per room) | One R3F `<Room>` scene per room: `.glb` environment + camera rig + hotspot definitions + navmesh | **High — this is the real work** |
| 2D sprites walking | Rigged 3D characters, Mixamo animation, click-to-move pathfinding | High |

New systems with no 2D counterpart:

- **Navmesh & locomotion** — bake a walkable mesh per room in Blender, `three-pathfinding`
  for paths, simple animation state machine (idle/walk/talk).
- **Room streaming** — load/unload room `.glb`s on door transitions with a fade; keeps
  memory and initial download small.
- **Camera director** — per-room camera volumes: walking into a zone cuts/blends to that
  zone's camera (the *Grim Fandango* trick).
- **Sister-swap (design opportunity)** — the 2D game stars Mackenzie and Cambrie; in 3D,
  swapping the controlled sister (with distinct abilities: Mac = physical/brave,
  Cambrie = scholarly/perceptive) turns a port into a genuinely new game. Scoped as a
  Act-1-late feature, prototyped early.

---

## 5. Technical architecture

```
games/sisters-quest-3d/          # standalone Vite + React + TypeScript app
├── src/
│   ├── engine/                  # room loader, camera director, navmesh, hotspots, save
│   ├── game/
│   │   ├── rooms/               # one module per room: hotspots, cameras, triggers
│   │   ├── data/                # dialogues, items (ported from 2D), flags
│   │   └── characters/          # player controller, NPC behaviors
│   ├── ui/                      # dialogue box, verb UI, inventory, menus (React DOM)
│   └── App.tsx
├── public/assets/               # .glb rooms & characters, music, portraits
└── vite.config.ts               # base: '/sisters-quest-3d/'
```

- **Same deployment pattern as `attention-matrix`:** `vite build` → copy `dist/` to
  `public/sisters-quest-3d/` in the Next.js site → Vercel serves it statically. The
  Next.js site links to it from a project page.
- **Asset budget:** ≤ 25 MB total for Act 1 (Draco-compressed glb, OGG-converted audio,
  KTX2 textures). First-load target ≤ 6 MB (menu + first room), rest lazy-loaded.
- **Save format:** carry over the 2D save shape (`inventory`, `flags`, `scene`) under a
  new key (`sq3d_v1_save`) plus player position — trivially familiar.

---

## 6. Milestones

### M0 — Tech spike (goal: prove the pipeline, ~1–2 weekends)
- Vite + R3F app boots inside the site at `/sisters-quest-3d/`
- One gray-box room (Queen's Chamber blockout), fixed camera
- Capsule "character" click-to-move on a navmesh
- One working hotspot: Look at the Queen → dialogue overlay with existing portrait art
- **Exit criteria:** the loop *walk → hover → verb → dialogue* feels good in the browser

### M1 — Vertical slice (goal: one real room, fully dressed)
- Queen's Chamber modeled, lit, and color-scripted to match its 2D painting
- Rigged sister character with idle/walk/talk (Mixamo), palace music playing
- Full Act 1 opening beat playable: examine Queen, tapestry, exit to Great Hall (gray-box)
- Save/load, main menu, verb UI final design
- **Exit criteria:** a stranger plays 5 minutes and understands the game with no help

### M2 — Chapter One content complete
- All 4–5 Act 1 rooms modeled; all Act 1 puzzles and dialogue ported
- Both sisters present; sister-swap prototype evaluated (ship or cut)
- Act 1 ending cinematic (in-engine, fixed cameras + dialogue)

### M3 — Polish & ship
- Postprocessing pass (fog, bloom, vignette), sound effects, footsteps
- Performance pass to hit asset budget; tablet input check
- Playtest round, then publish on the site alongside the 2D original

*(M4+ — later acts, one chapter at a time, reusing the whole pipeline.)*

---

## 7. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| **3D art is the bottleneck** (modeling rooms/characters dwarfs code effort) | High | Gray-box everything first; CC0 packs for props; strict low-poly style; ship fewer, better rooms |
| Character animation looks janky | Med | Mixamo + simple state machine; camera framing hides feet; stylized proportions forgive imperfection |
| Scope creep toward all 8 acts | High | Chapter One is the product; later acts are sequels, not scope |
| Web performance (mobile/older laptops) | Med | Asset budget enforced from M0; Draco/KTX2; room streaming; no physics engine |
| Fixed cameras feel dated to some players | Low | It's a deliberate genre statement — and optional camera nudge/parallax adds life cheaply |
| Solo-dev burnout | Med | Milestones sized in weekends; every milestone ends with something playable on the site |

---

## 8. Open questions (to settle before M1)

1. **Sister-swap as core mechanic** — ship Chapter One with it, or keep the 2D game's
   two-sisters-travel-together model? (Prototype in M1 decides.)
2. **Voice acting** — text-only like the classics, or record lines later? (Plan for
   text-only; keep dialogue data format VO-ready.)
3. **Remake vs. side story** — is Chapter One a retelling of the 2D Act 1, or a new
   prologue set in the same world (e.g., the night the Queen fell)? A new prologue avoids
   comparing the two versions and lets the 2D game stay canon.
4. **Title** — *Sisters' Quest 3D*, *Sisters' Quest: Chapter One*, or a new subtitle
   (*The Unweaving*?).

---

## 9. First concrete steps

1. Scaffold `games/sisters-quest-3d` (Vite + React + TS + R3F + drei + zustand)
2. Blender blockout of the Queen's Chamber from `queens-chamber.jpg`
3. Port `GameState` to a zustand store; drop `dialogues.js` Act 1 data in unchanged
4. Build the hotspot/raycast interaction component and the dialogue overlay
5. M0 exit-criteria demo, embedded on the site behind a `/lab` link
