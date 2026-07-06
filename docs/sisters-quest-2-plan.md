# Sisters' Quest II: The Moonbeam Mystery — Game Plan

*A 3D adventure game in the tradition of Sierra's King's Quest — the sequel to
"Sisters' Quest: The Moonveil Crown."*

**Status:** M0 tech spike complete — playable at `/sisters-quest-2` (source in `games/sisters-quest-2/`)
**Last updated:** 2026-07-06

---

## 1. Vision

A browser-playable 3D adventure game with the soul of classic King's Quest: a painterly
fairy-tale kingdom explored room by room, puzzles solved with wit and inventory items,
characters worth talking to, and death used sparingly (or not at all). Modern reference
points: *King's Quest (2015)*, *Grim Fandango Remastered*, and the fixed-camera charm of
early 3D adventures — not the open-world combat of *KQ8: Mask of Eternity*.

Rather than inventing a new world, this project is a **numbered sequel to Sisters' Quest**,
the 2D point-and-click already live on this site. *The Moonveil Crown* stays canon as the
first game; *The Moonbeam Mystery* is a new story in the same world, opening with a
playable prologue that bridges the two. Building in the established world gives us, on
day one:

- An established cast, kingdom, and backstory (with 8 acts of existing lore to draw on)
- 16 painted backgrounds that become 3D art direction / concept art
- A full soundtrack (6 tracks in `public/sisters-quest/assets/music/`)
- Proven game systems to port: `GameState`, `VerbSystem`, `DialogueSystem`, `MusicManager`
- Character portraits and sprites as modeling reference

### Story premise (working draft)

Some time after the events of *The Moonveil Crown*, the moonlight over Cresthollow begins
to go wrong: moonbeams land in the wrong places, or vanish before they touch the ground —
and things touched by the missing light start quietly disappearing with it. The palace
wants answers; Mackenzie wants the truth; Cambrie wants to know why nobody else finds it
funny that the moon is apparently *misfiring*. The sisters set out to trace the crooked
moonbeams to their source.

**Playable prologue:** a short, contained opening set in the palace on the first night a
moonbeam goes astray. It reintroduces the sisters and the world for new players, recaps
the first game in a few lines of dialogue, and teaches the two core mechanics (see §4.1)
before the map opens up. The prologue doubles as the M1 vertical slice.

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
   **Two sisters, two toolkits.** Swapping between Mackenzie and Cambrie is the core
   mechanic — every puzzle is authored knowing which sister (or which combination) it
   answers to.
3. **Story first, tech second.** Every technical choice is judged by whether it gets
   the prologue playable in 3D sooner.
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

### 3.4 Scope: Prologue + Chapter One is the game (for now)

In 3D, even a short adventure is a serious project. The shippable v1 is the **playable
prologue plus Chapter One** of *The Moonbeam Mystery*, with the architecture ready for
later chapters. Estimated room count: **5–6 rooms** — the prologue in the palace
(Queen's Chamber, Great Hall / moonlit courtyard), then Chapter One opening the
investigation outward (Palace Library, Cresthollow, one new "crooked moonbeam" site).
Familiar 2D locations are chosen deliberately: their paintings already exist as art
direction.

---

## 4. Systems design

### 4.1 The sister-swap mechanic (core)

The player controls one sister at a time and swaps freely (Tab key / click the inactive
portrait); the other sister follows and stays in the scene. Hotspots know which sister is
active and respond accordingly.

**Mackenzie — Intellect & Drive**

- **Insight:** an examine-deeper action on eligible hotspots — she reconstructs what
  happened, connects clues, deciphers mechanisms and old scripts. Insight findings land
  in a shared **casebook** (journal UI) that tracks the mystery.
- **Drive:** determination-gated physical actions — forcing a jammed door, climbing where
  others give up, refusing to be dismissed by an NPC (unlocks persistence dialogue
  options that reopen conversations Cambrie's charm can't).
- Fantasy: the sister who *will not let it go*. Her Look descriptions are precise,
  analytical, quietly intense.

**Cambrie — Dry Wit & Cleverness**

- **Improvise:** unconventional item use — combinations and applications Mackenzie would
  never sanction. Some inventory puzzles only accept Cambrie's off-label solution.
- **Disarm:** humor-based dialogue — she deflects, needles, and charms; certain NPCs only
  open up when the tension is punctured. Her jokes are also a stealth clue channel (the
  punchline often names the thing the player should look at next).
- Fantasy: the sister who solves the problem *sideways*. Her Look descriptions are the
  comic voice of the game — same hotspot, completely different read than Mackenzie's.

**Design rules**

1. Every room's hotspots have **per-sister Look text** — cheap to write, and the single
   biggest charm multiplier in the game.
2. Puzzles come in three flavors: Mackenzie-keyed, Cambrie-keyed, and **duet puzzles**
   requiring both (Mackenzie holds/forces/operates while Cambrie improvises, or
   Mackenzie's Insight decodes what Cambrie talked someone into revealing).
3. Never hard-block the player for being the "wrong" sister — the active sister comments
   and suggests her sibling ("This looks more like a *you* problem, Mac."), keeping the
   swap a delight rather than a toll.
4. The prologue teaches one Mackenzie-keyed puzzle, one Cambrie-keyed puzzle, and ends on
   a small duet puzzle.

### 4.2 Porting map

| 2D system | 3D equivalent | Effort |
|---|---|---|
| `GameState.js` (inventory, flags, localStorage save) | `zustand` store + `persist` middleware — near-mechanical port | Low |
| `VerbSystem.js` (look/talk/take/use) | Hotspot components: raycast hover → verb ring / context menu; same verb keys so puzzle logic ports | Low-Med |
| `DialogueSystem.js` + `dialogues.js` | React dialogue overlay; **same `{speaker, text}` data shape** (new script, reused format + portraits), extended with per-line `id` and optional `audio` field so lines are voice-ready from day one | Low |
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
- **Sister-swap & follower AI** — the core mechanic (§4.1): active-sister state, the
  follower pathing behind on the navmesh, per-sister hotspot responses, and the shared
  casebook UI. Prototyped in M0 with capsules before any real art exists.
- **Voice playback (deferred, designed-for now)** — every dialogue line carries a stable
  `id`; a VO manifest maps `id → audio file`. Text-only at launch; recording sessions can
  fill the manifest later with zero code changes (see §8).

---

## 5. Technical architecture

```
games/sisters-quest-2/           # standalone Vite + React + TypeScript app
├── src/
│   ├── engine/                  # room loader, camera director, navmesh, hotspots, save
│   ├── game/
│   │   ├── rooms/               # one module per room: hotspots, cameras, triggers
│   │   ├── data/                # dialogues (VO-ready ids), items, flags, casebook
│   │   └── characters/          # sister controllers, swap/follower logic, NPC behaviors
│   ├── ui/                      # dialogue box, verb UI, inventory, casebook, menus
│   └── App.tsx
├── public/assets/               # .glb rooms & characters, music, portraits, (later) vo/
└── vite.config.ts               # base: '/sisters-quest-2/'
```

- **Same deployment pattern as `attention-matrix`:** `vite build` → copy `dist/` to
  `public/sisters-quest-2/` in the Next.js site → Vercel serves it statically. The
  Next.js site links to it from a project page.
- **Asset budget:** ≤ 25 MB total for the v1 release (Draco-compressed glb, OGG-converted
  audio, KTX2 textures). First-load target ≤ 6 MB (menu + first room), rest lazy-loaded.
  VO audio (when it arrives) is lazy-loaded per room and sits outside this budget.
- **Save format:** carry over the 2D save shape (`inventory`, `flags`, `scene`) under a
  new key (`sq2_v1_save`) plus player position, active sister, and casebook entries.

---

## 6. Milestones

### M0 — Tech spike (goal: prove the pipeline, ~1–2 weekends)
- Vite + R3F app boots inside the site at `/sisters-quest-2/`
- One gray-box room (Queen's Chamber blockout), fixed camera
- **Two capsule "sisters"**: click-to-move on a navmesh, Tab to swap, follower trails the
  active sister
- One working per-sister hotspot: both sisters can Look at the same object and say
  different things → dialogue overlay with existing portrait art
- **Exit criteria:** the loop *walk → swap → hover → verb → dialogue* feels good in the
  browser

### M1 — Vertical slice = the prologue's first room
- Queen's Chamber modeled, lit, and color-scripted to match its 2D painting
- Both sisters rigged with idle/walk/talk (Mixamo), palace music playing
- Prologue opening beat playable: the first crooked moonbeam, one Mackenzie Insight, one
  Cambrie Disarm, exit toward the courtyard (gray-box)
- Save/load, main menu, verb UI and casebook UI final design
- **Exit criteria:** a stranger plays 5 minutes, understands both sisters' kits, and
  laughs at least once at Cambrie

### M2 — Prologue + Chapter One content complete
- All 5–6 rooms modeled; all puzzles and dialogue in (Mackenzie-keyed, Cambrie-keyed, and
  the duet puzzles)
- Prologue ending cinematic (in-engine, fixed cameras + dialogue)
- Full dialogue script locked with stable line ids — this is the VO-ready freeze point

### M3 — Polish & ship (text-only release)
- Postprocessing pass (fog, bloom, vignette), sound effects, footsteps
- Performance pass to hit asset budget; tablet input check
- Playtest round, then publish on the site alongside the 2D original

### M4 — Voice acting pass (post-launch update)
- Script is already frozen and id-stamped from M2; export per-character line sheets
- Cast and record (family/friends first pass? — fits the game's spirit), or AI-assisted
  scratch VO to prove the pipeline before committing to real sessions
- Drop audio files into the VO manifest; ship as a content update, no code changes

*(M5+ — later chapters of the mystery, one at a time, reusing the whole pipeline.)*

---

## 7. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| **3D art is the bottleneck** (modeling rooms/characters dwarfs code effort) | High | Gray-box everything first; CC0 packs for props; strict low-poly style; ship fewer, better rooms |
| Character animation looks janky | Med | Mixamo + simple state machine; camera framing hides feet; stylized proportions forgive imperfection |
| Scope creep toward a full-length sequel | High | Prologue + Chapter One is the product; later chapters ship as updates, not scope |
| Duet puzzles are hard to author well | Med | Only 1–2 in v1; prototype the swap/follower feel in M0 gray-box before writing them |
| Web performance (mobile/older laptops) | Med | Asset budget enforced from M0; Draco/KTX2; room streaming; no physics engine |
| Fixed cameras feel dated to some players | Low | It's a deliberate genre statement — and optional camera nudge/parallax adds life cheaply |
| Solo-dev burnout | Med | Milestones sized in weekends; every milestone ends with something playable on the site |

---

## 8. Decisions log (settled 2026-07-06)

1. **Sister-swap is the core mechanic.** Cambrie's kit is built on dry wit and cleverness
   (Improvise, Disarm); Mackenzie's on intellect and drive (Insight, Drive). Full design
   in §4.1.
2. **Voice acting: eventually.** Ship v1 text-only; every dialogue line carries a stable
   id from day one so VO drops in as a post-launch content update (M4) with no code
   changes.
3. **New story, not a remake.** *The Moonveil Crown* stays canon; this game opens with a
   playable prologue that bridges into the new mystery.
4. **Title: *Sisters' Quest II: The Moonbeam Mystery*.**

### Voice-acting readiness rules (enforced from M0)

- Every dialogue line: `{ id, speaker, text, audio? }` — ids never change once assigned
- No dialogue text generated at runtime (no string interpolation into spoken lines);
  variable content goes in narrator text or UI, not voiced lines
- Dialogue overlay already supports an optional audio clip per line: plays clip, advances
  on clip end or click, falls back to text-only when `audio` is absent
- Casebook and Look descriptions are candidates for *partial* VO — decide at M4, don't
  block on it

---

## 9. First concrete steps

1. Scaffold `games/sisters-quest-2` (Vite + React + TS + R3F + drei + zustand)
2. Blender blockout of the Queen's Chamber from `queens-chamber.jpg`
3. Port `GameState` to a zustand store; define the VO-ready dialogue schema and the
   per-sister hotspot response shape
4. Build sister-swap + follower movement with capsules; hotspot/raycast interaction and
   the dialogue overlay
5. M0 exit-criteria demo, embedded on the site behind a `/lab` link
