// ============================================================
// data/dialogues-acts2to8.js — Sisters' Quest: The Moonveil Crown
// Dialogue for Acts 2 through 8
// Plain browser JS (no ES modules) — loaded via <script> tag
// ============================================================

// Additional portrait definitions for new speakers
const PORTRAITS2 = {
  bram:       { color: 0x3a2510, label: 'Br', name: 'BRAM' },
  wayne:      { color: 0x2a5a7a, label: 'W',  name: 'WAYNE HAVASU' },
  farris:     { color: 0x1a2a1a, label: 'F',  name: 'EDWARD FARRIS' },
  jennibelle: { color: 0xc87040, label: 'J',  name: 'JENNIBELLE' },
  tideking:   { color: 0x0a1a3a, label: 'TK', name: 'TIDE KING OF POOLVILLE' },
  thorn:      { color: 0x3a5a1a, label: 'T',  name: 'THORN' },
  witch:      { color: 0x2a0a3a, label: 'LW', name: 'LOOM WITCH' },
  dorian:     { color: 0x5a5a5a, label: 'D',  name: 'PRINCE DORIAN' },
  mira:       { color: 0x0a3a5a, label: 'Mi', name: 'SELKIE MIRA' },
  vessa:      { color: 0x1a0a2a, label: 'V',  name: 'VESSA' },
};

Object.assign(PORTRAITS, PORTRAITS2);

// ============================================================
// ACT 2 — CRESTHOLLOW DIALOGUES
// ============================================================

// ── Cresthollow Village Square ─────────────────────────────

const DIALOGUE_CRESTHOLLOW_ENTER = [
  { speaker: 'narrator', text: "Cresthollow is a market village at the edge of the Thornwood. The gates to the forest are sealed with iron chains. A hand-painted sign reads: 'THORNWOOD CLOSED. Witch business. Do not inquire.'" },
  { speaker: 'mackenzie', text: "Naturally." },
  { speaker: 'cambrie', text: "The atlas route goes through the Thornwood. We need to find out who sealed it and why." },
  { speaker: 'mackenzie', text: "And whether we can un-seal it." },
  { speaker: 'cambrie', text: "Yes. That part too." },
];

const DIALOGUE_BRAM_FIRST = [
  { speaker: 'bram', text: "Ah. Strangers. With the look of trouble about them. Welcome to the Rusty Plow." },
  { speaker: 'mackenzie', text: "We need information about the Thornwood." },
  { speaker: 'bram', text: "Course you do. Everyone does. Nobody ever comes in wanting a room and a quiet meal anymore." },
  { speaker: 'cambrie', text: "We'd like a room and a quiet meal as well. And information." },
  { speaker: 'bram', text: "Now that I can work with. Sit. The Thornwood's been sealed for three weeks — since the Loom Witch put her mark on the gate. She's angry about something. Nobody's been through." },
  { speaker: 'mackenzie', text: "How do we get through?" },
  { speaker: 'bram', text: "You'd need her permission. Which means going to the Witch's Hollow — edge of the wood, before the sealed gate. She still receives visitors there. Whether she helps them is another matter." },
  { speaker: 'cambrie', text: "There's a goat, too. The atlas mentions a goat?" },
  { speaker: 'bram', text: "Thorn. Yes. He lives at the Hollow and considers himself the Witch's assistant. He is... particular." },
];

const DIALOGUE_BRAM_REPEAT = [
  { speaker: 'bram', text: "The Witch's Hollow is at the edge of the wood. Thorn the goat guards it. Be polite to the goat. I mean that sincerely." },
];

const DIALOGUE_BRAM_HARBOR = [
  { speaker: 'cambrie', text: "What about the harbor? We'll need to cross to the Isle of Tides eventually." },
  { speaker: 'bram', text: "Harbor's under quarantine — some kind of sea-creature sighting. Edward Farris has locked the boats. He's the Harbor Master. Reasonable man, mostly. Has opinions about paperwork." },
  { speaker: 'mackenzie', text: "Of course he does." },
  { speaker: 'bram', text: "There's also Wayne Havasu — lives on the south shore in a shack. Has a boat. Very relaxed man. He might be willing to help if you talk to him right." },
];

// ── Wayne Havasu / South Shore Shack ──────────────────────

const DIALOGUE_WAYNE_FIRST = [
  { speaker: 'narrator', text: "The south shore shack smells of grilled fish and cedar. A man in his fifties sits on a battered chair, watching the water. His hair is silver-streaked, his eyes kind. Two surfboards lean against the wall. A guitar rests against a cooler." },
  { speaker: 'wayne', text: "Hey there. You look like you've been walking a while. Sit down." },
  { speaker: 'mackenzie', text: "We need to get to the Isle of Tides. Harbor's closed." },
  { speaker: 'wayne', text: "Harbor's always closed for something. You want fish? I've got fish, rice, beans. Made too much anyway." },
  { speaker: 'cambrie', text: "We're on a time limit—" },
  { speaker: 'wayne', text: "You can eat fast. What's your name?" },
  { speaker: 'mackenzie', text: "Mackenzie. My sister Cambrie." },
  { speaker: 'wayne', text: "I'm Wayne. Wayne Havasu. Sit down, Mackenzie. You remind me of Jennibelle. She argues with me about everything too." },
];

const DIALOGUE_JENNIBELLE_INTRO = [
  { speaker: 'narrator', text: "A young woman appears from around the side of the shack, lugging a surfboard almost as tall as she is." },
  { speaker: 'jennibelle', text: "Wayne! The left fin is rattling again. I told you—" },
  { speaker: 'wayne', text: "Jennibelle. We have guests. Don't rattle." },
  { speaker: 'jennibelle', text: "Oh! Sorry. Hi. I'm Jennibelle. He fixes everything with duct tape, it's a whole thing." },
  { speaker: 'cambrie', text: "Do you two live here together?" },
  { speaker: 'jennibelle', text: "We do. I followed him out here two seasons ago and never really left." },
];

const DIALOGUE_WAYNE_BOAT = [
  { speaker: 'wayne', text: "Isle of Tides. Yeah, I can take you. Got nothing else pressing. But—" },
  { speaker: 'mackenzie', text: "There's a condition." },
  { speaker: 'wayne', text: "Not a condition. Just — eat first. It'll take a couple hours and you both look like you skipped breakfast." },
  { speaker: 'cambrie', text: "We did skip breakfast." },
  { speaker: 'wayne', text: "Yeah. I know that look. Sit down." },
];

const DIALOGUE_WAYNE_TALK_AGAIN = [
  { speaker: 'wayne', text: "Eat. We'll leave when you're ready. The water's calm today — good crossing." },
];

const DIALOGUE_WAYNE_GUITAR = [
  { speaker: 'cambrie', text: "Is that your guitar?" },
  { speaker: 'wayne', text: "Yeah. I play most evenings. Nothing fancy." },
  { speaker: 'cambrie', text: "Do you play anything in particular?" },
  { speaker: 'wayne', text: "Old songs mostly. Things my father taught me. Some I made up over the years. Music's good for the long days." },
];

const DIALOGUE_WAYNE_FAREWELL = [
  { speaker: 'narrator', text: "Wayne loads the boat. He hands the sisters each a small cloth pouch." },
  { speaker: 'wayne', text: "For the road. Don't argue." },
  { speaker: 'mackenzie', text: "We can't—" },
  { speaker: 'wayne', text: "You're going somewhere hard and coming back harder. Take it." },
  { speaker: 'cambrie', text: "Thank you, Wayne." },
  { speaker: 'wayne', text: "You know what I believe?" },
  { speaker: 'wayne', text: "You're braver than you believe, and stronger than you seem, and smarter than you think. But the most important thing is — even if we're apart, I'll always be with you." },
  { speaker: 'mackenzie', text: "...Wayne, you barely know us." },
  { speaker: 'wayne', text: "I know enough. Go. Your mother needs you." },
  { speaker: 'narrator', text: "Jennibelle waved from the shore until she was too small to see." },
];

// ── Edward Farris / Harbor ─────────────────────────────────

const DIALOGUE_FARRIS_FIRST = [
  { speaker: 'narrator', text: "Edward Farris's office is a wall of filing cabinets and the smell of brine. He sits behind a desk the size of a small country, stamping things." },
  { speaker: 'farris', text: "Harbor's closed. Whatever you need, the answer is no." },
  { speaker: 'mackenzie', text: "We need passage to the Isle of Tides." },
  { speaker: 'farris', text: "The answer is still no. Sea creature sighting. Protocol." },
  { speaker: 'cambrie', text: "What kind of sea creature?" },
  { speaker: 'farris', text: "A large one. With significant opinions about boats. Look, I have forty-seven forms to stamp by end of day—" },
  { speaker: 'cambrie', text: "We're not here for a boat. We need a ship's manifest. Specifically for a vessel called the Sable Dawn." },
  { speaker: 'farris', text: "...The Sable Dawn. That's a wreck record. That's in the archive. Why do you need a wreck record?" },
  { speaker: 'mackenzie', text: "It's complicated." },
  { speaker: 'farris', text: "It's always complicated when people won't explain themselves. Fine. Give me a moment." },
];

const DIALOGUE_FARRIS_GIVES_MANIFEST = [
  { speaker: 'farris', text: "Here. The Sable Dawn manifest. Wrecked eleven years ago in the Tidal Shallows. Cargo included... hmm. 'One seal-skin cloak, grey, listed as salvage. Origin unknown.'" },
  { speaker: 'cambrie', text: "Not salvage." },
  { speaker: 'farris', text: "...No. Probably not. There was a creature spotted near the wreck site for years after. Wouldn't go near it." },
  { speaker: 'mackenzie', text: "A selkie." },
  { speaker: 'farris', text: "I don't put things like that in the official records. Too many forms. Take the manifest. And here—" },
  { speaker: 'narrator', text: "He stamps a pass and slides it across the desk." },
  { speaker: 'farris', text: "Harbor pass. In case you find a boat that isn't mine. I'm not condoning anything. This is purely bureaucratic." },
];

const DIALOGUE_FARRIS_REPEAT = [
  { speaker: 'farris', text: "I have forms to stamp. Take the manifest and the pass and go find your selkie." },
];

// ── Tide King of Poolville ─────────────────────────────────

const DIALOGUE_TIDEKING_SHRINE = [
  { speaker: 'narrator', text: "The tide pool shrine is carved into the cliff face, filled with sea glass and kelp offerings. A large figure sits in the pool itself — half-submerged, patient as the tide." },
  { speaker: 'tideking', text: "Two landwalkers. At the shrine. This is unusual." },
  { speaker: 'cambrie', text: "Are you the Tide King of Poolville?" },
  { speaker: 'tideking', text: "I am. You may call me that. The full title is longer and takes three tides to say properly." },
  { speaker: 'mackenzie', text: "We're looking for a selkie named Mira. We have her seal-skin." },
  { speaker: 'tideking', text: "...You have Mira's skin. You didn't take it." },
  { speaker: 'cambrie', text: "No. It was listed as salvage. We retrieved it from the records." },
  { speaker: 'tideking', text: "She has been waiting eleven years. She cannot return to the sea without it. She has been... watching the water from the shore." },
];

const DIALOGUE_TIDEKING_SONNET = [
  { speaker: 'tideking', text: "Before I tell you where Mira walks, you must answer for what the land-people did. Not punishment. Acknowledgment." },
  { speaker: 'tideking', text: "Tell me a truth about something you lost. In the form of a sonnet." },
  { speaker: 'mackenzie', text: "A sonnet." },
  { speaker: 'tideking', text: "Or fourteen lines of earnest feeling. I am not strict about meter." },
  { speaker: 'cambrie', text: "Our mother is being unraveled by a curse. She has seven days — six, now. We came all this way because we love her and we refuse to let her disappear without a fight." },
  { speaker: 'cambrie', text: "She taught us to read. She stayed up when we were sick. She wrote us notes in our lunches until we were embarrassed by it, and then we missed those notes when they stopped. She has a laugh that fills a whole room." },
  { speaker: 'cambrie', text: "That's not a sonnet. But it's true." },
  { speaker: 'tideking', text: "...That will do. Mira walks the north cliff at evening. She watches the sea. Give her back what was taken." },
];

const DIALOGUE_TIDEKING_REPEAT = [
  { speaker: 'tideking', text: "Mira walks the north cliff at evening. Go to her." },
];

// ============================================================
// ACT 3 — THORNWOOD & WITCH'S HOLLOW DIALOGUES
// ============================================================

// ── Thornwood / Witch's Hollow ─────────────────────────────

const DIALOGUE_THORNWOOD_ENTER = [
  { speaker: 'narrator', text: "The Thornwood's edge is all gnarled roots and shadow. The iron-chained gate looms ahead. Beyond it, something moves in the dark between the trees." },
  { speaker: 'mackenzie', text: "The Witch's Hollow is before the gate. If Bram's right, we talk to the goat first." },
  { speaker: 'cambrie', text: "We talk to the goat." },
  { speaker: 'mackenzie', text: "We talk to the goat." },
];

const DIALOGUE_THORN_FIRST = [
  { speaker: 'narrator', text: "A small black goat stands in the clearing before the hollow entrance. He regards you with large amber eyes and extraordinary composure." },
  { speaker: 'thorn', text: "State your name and purpose. In full. No abbreviations." },
  { speaker: 'mackenzie', text: "Mackenzie. Cambrie. Daughters of Queen Elara. We need passage through the Thornwood to reach the Mirrored Mere." },
  { speaker: 'thorn', text: "Queen Elara. The one who had the Crown." },
  { speaker: 'cambrie', text: "Yes. She's cursed. We're fixing it." },
  { speaker: 'thorn', text: "Fixing it. Just like that. Eleven years of injustice, and you're going to fix it." },
  { speaker: 'thorn', text: "I appreciate the confidence. The Witch will see you. I will require, before you pass, that you hear my sonnet." },
  { speaker: 'mackenzie', text: "Your sonnet." },
  { speaker: 'thorn', text: "I have composed a sonnet. It is about longing. You will listen." },
];

const DIALOGUE_THORN_SONNET = [
  { speaker: 'thorn', text: "'Oh fence post, tall and true, / I circle round your wood each day, / The other goats think me askew / But what do other goats know, anyway?'" },
  { speaker: 'thorn', text: "'Your splinters catch the morning light / In ways that make me pause and stare / You are a most becoming sight / You do not know that I am there.'" },
  { speaker: 'thorn', text: "'But I am there. I am always there. / In rain and sun and frost and dew. / No goat has loved as I have loved / A fence post as I've loved you.'" },
  { speaker: 'thorn', text: "It does not scan perfectly in the third quatrain. I am aware. The emotion required a concession." },
  { speaker: 'cambrie', text: "It was beautiful, Thorn." },
  { speaker: 'thorn', text: "Yes. It was. You may take a copy. I have several." },
  { speaker: 'mackenzie', text: "What do we do with a goat's sonnet?" },
  { speaker: 'thorn', text: "It has sentimental value. Now go in. Don't touch anything that glows." },
];

const DIALOGUE_THORN_REPEAT = [
  { speaker: 'thorn', text: "The Witch is inside. She is expecting you. Don't touch anything that glows. I said that clearly." },
];

// ── Loom Witch / Witch's Hollow ────────────────────────────

const DIALOGUE_WITCH_FIRST = [
  { speaker: 'narrator', text: "The Hollow is a cave hung with woven things — not tapestries exactly, more like memories made solid. Patterns shift when you're not looking at them directly. The Loom Witch stands at a large loom in the center, her back to you." },
  { speaker: 'witch', text: "I wondered when someone would come. I hoped it would be the sisters." },
  { speaker: 'cambrie', text: "You know who we are?" },
  { speaker: 'witch', text: "I know the weave of everyone who carries a queen's grief. You want through my wood. You want the Mere. You want the Shard." },
  { speaker: 'mackenzie', text: "We need to save our mother." },
  { speaker: 'witch', text: "Your mother wronged Vessa. So did every lord and official who scratched her name from the record. I sealed the Thornwood because I am tired of being convenient. Of being passed through without being seen." },
  { speaker: 'cambrie', text: "We see you." },
  { speaker: 'witch', text: "Do you. Then answer me this: what is the one thing that cannot be taken from a maker?" },
];

const DIALOGUE_WITCH_RIDDLE_WRONG = [
  { speaker: 'witch', text: "No. Think again. A work can be stolen. A name can be scratched out. What remains?" },
];

const DIALOGUE_WITCH_RIDDLE_RIGHT = [
  { speaker: 'cambrie', text: "The act of making. The knowledge that it was made. Vessa made the Crown. She made the tapestry. Whatever anyone does to her name — she made those things. That's hers. Always." },
  { speaker: 'witch', text: "...Yes." },
  { speaker: 'witch', text: "I have sealed this wood for three weeks waiting for someone to say that." },
  { speaker: 'narrator', text: "She draws back a bolt on the inner gate and presses a woven token into Cambrie's hand." },
  { speaker: 'witch', text: "The Mirrored Mere is three hours through the wood. The Shard rises at moonlight. You will know it when you see it." },
  { speaker: 'witch', text: "And when you face Vessa — tell her the Loom Witch of the Thornwood still remembers the year of the Silver Moon. Tell her she is not forgotten here." },
];

const DIALOGUE_WITCH_REPEAT = [
  { speaker: 'witch', text: "Three hours through the wood. The Shard rises at moonlight. Remember what I told you to tell her." },
];

// ============================================================
// ACT 4 — MIRRORED MERE DIALOGUES
// ============================================================

// ── Mirrored Mere ─────────────────────────────────────────

const DIALOGUE_MERE_ENTER = [
  { speaker: 'narrator', text: "The Mirrored Mere is perfectly still — a circle of water so clear it looks like a hole in the world. The moon above is reflected so precisely that looking down feels like looking up." },
  { speaker: 'cambrie', text: "It's beautiful." },
  { speaker: 'mackenzie', text: "It's very quiet." },
  { speaker: 'cambrie', text: "That's what beautiful sounds like sometimes." },
];

const DIALOGUE_MERE_MOON_RISES = [
  { speaker: 'narrator', text: "As the moon clears the treetops, something stirs beneath the surface of the Mere. A point of light rises — slowly, unhurriedly — until it breaks the surface and hangs in the air." },
  { speaker: 'narrator', text: "A fragment of crystallized starlight. The Starlight Shard, first component of the Moonveil Crown." },
  { speaker: 'cambrie', text: "Mac. There it is." },
  { speaker: 'mackenzie', text: "Take it." },
  { speaker: 'narrator', text: "Cambrie reaches out. The Shard settles into her palm like it was waiting. It is warm." },
  { speaker: 'cambrie', text: "One." },
  { speaker: 'mackenzie', text: "Two more." },
];

const DIALOGUE_MERE_SHARD_LOOK = [
  { speaker: 'cambrie', text: "It hums when I hold it. Like it recognizes something." },
  { speaker: 'mackenzie', text: "Let's not get sentimental about the magic rock." },
  { speaker: 'cambrie', text: "It's a crystallized fragment of starlight, Mac. Some sentimentality is appropriate." },
];

// ============================================================
// ACT 5 — SUNKEN GARDEN & PRINCE DORIAN DIALOGUES
// ============================================================

// ── Sunken Garden ─────────────────────────────────────────

const DIALOGUE_GARDEN_ENTER = [
  { speaker: 'narrator', text: "The Sunken Garden is exactly as described — a walled garden half-swallowed by the sea over three centuries, its stonework draped in silver-green sea plants. In the center, a dry fountain still stands, its basin carved with scenes of a kingdom now underwater." },
  { speaker: 'cambrie', text: "The moonveil thread grows near the fountain. The atlas was specific." },
  { speaker: 'mackenzie', text: "And the Prince?" },
  { speaker: 'cambrie', text: "Prince Dorian. Cursed forty years ago. Turned to stone and placed in the garden. He was the one who — oh, Mac. The atlas says he was the one who first scratched Vessa's name from the tapestry." },
  { speaker: 'mackenzie', text: "On whose orders?" },
  { speaker: 'cambrie', text: "The record doesn't say." },
];

const DIALOGUE_DORIAN_LOOK = [
  { speaker: 'narrator', text: "A statue stands at the garden's edge — a young man in stone, his expression not frozen but somehow still present. There is sorrow in it. Real sorrow, worn smooth by forty years of rain." },
  { speaker: 'cambrie', text: "Prince Dorian. He can't be more than twenty, the way he's carved. He's been stone since before Mother was queen." },
  { speaker: 'mackenzie', text: "He scratched the name." },
  { speaker: 'cambrie', text: "I don't think the stone chose to. Look at his face." },
];

const DIALOGUE_DORIAN_WAKES = [
  { speaker: 'narrator', text: "When Cambrie lays the Starlight Shard against the statue's chest, something shifts. Slowly. Like a tide going out in reverse." },
  { speaker: 'narrator', text: "The stone bleeds color. First gray to brown to warm. Then Dorian breathes." },
  { speaker: 'dorian', text: "...I thought — I thought no one would come." },
  { speaker: 'cambrie', text: "We didn't know you were here." },
  { speaker: 'dorian', text: "It's all right. Forty years is — it gives you time to think. I've been thinking about the name." },
  { speaker: 'mackenzie', text: "Vessa's name." },
  { speaker: 'dorian', text: "My father told me to scratch it out. I was seventeen. I didn't understand what it meant to be the one who does the scratching." },
  { speaker: 'dorian', text: "I've had forty years to understand. I would like very much to unmake what I did. If there is a way." },
  { speaker: 'cambrie', text: "There might be. We're going to Vessa's tower." },
  { speaker: 'dorian', text: "Tell her — tell her I am sorry. With my whole self. Not for forgiveness. Just so she knows." },
  { speaker: 'narrator', text: "He pressed a small carved stone flower into Cambrie's hand. His hands shook." },
];

const DIALOGUE_MOONVEIL_FOUND = [
  { speaker: 'narrator', text: "Near the fountain's base, growing up through the cracks in the stone — silver-threaded plants, their stems glowing faintly. Moonveil thread, exactly as described." },
  { speaker: 'cambrie', text: "It grows here because the garden floods at high tide. Moonlight reflected in moving water. That's the only place it can grow." },
  { speaker: 'mackenzie', text: "How do you know that?" },
  { speaker: 'cambrie', text: "Page forty-seven of Magical Fibers." },
  { speaker: 'mackenzie', text: "Of course it was page forty-seven." },
];

// ============================================================
// ACT 6 — ISLE OF TIDES & SELKIE MIRA DIALOGUES
// ============================================================

// ── Isle of Tides / Selkie Mira ────────────────────────────

const DIALOGUE_ISLE_ARRIVE = [
  { speaker: 'narrator', text: "Wayne's boat runs aground on the Isle of Tides' rocky shore. The island is small — an hour's walk end to end — but its tide pools are extraordinary. Every color of sea glass glitters in the shallows." },
  { speaker: 'mackenzie', text: "North cliff. The Tide King said north cliff." },
];

const DIALOGUE_MIRA_FIRST = [
  { speaker: 'narrator', text: "A woman sits at the cliff's edge, her feet dangling above the water. She has been there long enough that the wind has memorized her. She doesn't turn when she hears you coming." },
  { speaker: 'mira', text: "You're not from here." },
  { speaker: 'cambrie', text: "No. Are you Mira?" },
  { speaker: 'mira', text: "I am. I was. I'm... between things at the moment. The sea and the land. Eleven years between." },
  { speaker: 'mackenzie', text: "We have something for you." },
  { speaker: 'narrator', text: "Cambrie holds out the seal-skin. For a moment Mira doesn't move. Then she turns." },
];

const DIALOGUE_MIRA_RECEIVES_SKIN = [
  { speaker: 'narrator', text: "Mira stares at the seal-skin for a long time. Her hand reaches out and touches it — just the edge — as if she's checking whether it's real." },
  { speaker: 'mira', text: "...How." },
  { speaker: 'cambrie', text: "A ship's manifest. The Harbor Master's records. Your skin was listed as salvage from the Sable Dawn wreck. It wasn't salvage." },
  { speaker: 'mira', text: "No. It wasn't." },
  { speaker: 'narrator', text: "She takes the skin. Presses it to her face. When she looks up there is salt water on her cheeks and it might be the sea spray or it might not be." },
  { speaker: 'mira', text: "What do you need? I will give you anything." },
  { speaker: 'mackenzie', text: "The Sea-Glass Heart. It's in the wreck. The Sable Dawn." },
  { speaker: 'mira', text: "I know the wreck. I've circled it for eleven years. I'll take you there." },
];

const DIALOGUE_MIRA_WRECK = [
  { speaker: 'narrator', text: "Mira dives and resurfaces twice while the sisters wade in the shallows. When she comes up the third time, something glows in her hand." },
  { speaker: 'mira', text: "It was in the hold. Right where I last saw it — I didn't know what it was, just that it was beautiful. Here." },
  { speaker: 'narrator', text: "A piece of sea glass shaped like a heart. It catches the light and holds it." },
  { speaker: 'cambrie', text: "The Sea-Glass Heart. Second piece." },
  { speaker: 'mira', text: "Where are you going with these things?" },
  { speaker: 'mackenzie', text: "Vessa's tower. Obsidian Isle." },
  { speaker: 'mira', text: "Then you'll need to go at dawn. The currents shift. I'll mark your chart. And — thank you. For seeing the manifest." },
];

const DIALOGUE_MIRA_REPEAT = [
  { speaker: 'mira', text: "The Obsidian Isle is two hours by sail at dawn. The currents will be with you. Go." },
];

// ============================================================
// ACT 7 — OBSIDIAN ISLE APPROACH
// ============================================================

// ── Obsidian Isle ─────────────────────────────────────────

const DIALOGUE_OBSIDIAN_ARRIVE = [
  { speaker: 'narrator', text: "The Obsidian Isle rises from the sea like a broken tooth. Its cliffs are black volcanic glass that catch the sunrise in long fractured reflections. At the summit, a tower." },
  { speaker: 'mackenzie', text: "We made it." },
  { speaker: 'cambrie', text: "Day six. We have time." },
  { speaker: 'mackenzie', text: "Barely." },
  { speaker: 'cambrie', text: "Barely counts." },
];

const DIALOGUE_OBSIDIAN_DOOR = [
  { speaker: 'narrator', text: "The tower door is open. Not unlocked — open, as if she's been watching the horizon and left it that way." },
  { speaker: 'cambrie', text: "She knows we're here." },
  { speaker: 'mackenzie', text: "Good. Let's not waste time." },
];

// ============================================================
// ACT 8 — VESSA'S TOWER DIALOGUES
// ============================================================

// ── Vessa's Tower — Final Confrontation ───────────────────

const DIALOGUE_VESSA_FIRST = [
  { speaker: 'narrator', text: "The tower's interior is a single great room. Looms fill every wall — some active, threads moving on their own, some dark and still. In the center, Vessa sits at the largest loom. She is older than expected. Her hands do not stop moving." },
  { speaker: 'vessa', text: "Mackenzie. Cambrie. You took your time." },
  { speaker: 'mackenzie', text: "Seven days isn't much time—" },
  { speaker: 'vessa', text: "I gave seven days. I wasn't sure you'd use them well." },
  { speaker: 'cambrie', text: "You cursed our mother." },
  { speaker: 'vessa', text: "Your mother had my name erased. Forty years of work, and not one letter of my name left in the official record. Not in the tapestry. Not in the crown. Nothing." },
  { speaker: 'vessa', text: "I gave the Moonveil Crown freely. As a gift. And the queen gave it to the council, and the council scratched my name from everything, and everyone agreed that was fine." },
  { speaker: 'mackenzie', text: "It wasn't fine." },
  { speaker: 'vessa', text: "No." },
];

const DIALOGUE_VESSA_PIECES = [
  { speaker: 'cambrie', text: "We have the pieces. The Starlight Shard, the Sea-Glass Heart, the Moonveil Thread. We can rebuild the Crown." },
  { speaker: 'vessa', text: "You found all three." },
  { speaker: 'vessa', text: "Do you know what that means? That means someone along the way helped you. Nobody helps without a reason." },
  { speaker: 'cambrie', text: "The Loom Witch sends her regards. She said to tell you she still remembers the year of the Silver Moon. That you are not forgotten there." },
  { speaker: 'narrator', text: "Vessa's hands stop moving. First time since the sisters entered." },
  { speaker: 'vessa', text: "...Elara." },
  { speaker: 'cambrie', text: "Prince Dorian is awake. He asked us to tell you he is sorry — not for forgiveness, just so you know." },
  { speaker: 'vessa', text: "He has been stone for forty years." },
  { speaker: 'cambrie', text: "Yes." },
  { speaker: 'vessa', text: "And you went there anyway. You woke him and listened and carried his words all this way." },
];

const DIALOGUE_VESSA_CHOICE = [
  { speaker: 'vessa', text: "I could rebuild the Crown myself. It would take me an hour. But I will not undo the curse until my name is restored — officially, permanently, in the palace records and on the Crown itself." },
  { speaker: 'mackenzie', text: "Done. I'll sign it myself." },
  { speaker: 'vessa', text: "A princess's signature doesn't bind." },
  { speaker: 'cambrie', text: "Mother will sign it when she wakes. We'll make sure of it. But—" },
  { speaker: 'cambrie', text: "You could also trust us. You could give us the Crown — let us take it to her now — and trust that we will make it right. Tonight, while she still has time." },
  { speaker: 'vessa', text: "Trust. You're asking me to trust." },
  { speaker: 'cambrie', text: "We came all this way. We listened to everyone who was wronged. We carried their words. We have the pieces. We're asking you to let us finish this — together." },
];

const DIALOGUE_VESSA_TRUST = [
  { speaker: 'narrator', text: "Vessa looks at the pieces of the Crown laid on her workbench. Then at the sisters." },
  { speaker: 'vessa', text: "...Leave them with me. Come back in the morning." },
  { speaker: 'mackenzie', text: "Morning is — we have one day—" },
  { speaker: 'vessa', text: "I work fast when I choose to. Come back at dawn." },
  { speaker: 'narrator', text: "The sisters slept on the shore. They barely slept at all." },
];

const DIALOGUE_VESSA_REFUSES = [
  { speaker: 'vessa', text: "No. I have waited forty years. I will not hand over the Crown on a promise. Bring me the official restoration order and I will lift the curse that hour." },
  { speaker: 'mackenzie', text: "Our mother—" },
  { speaker: 'vessa', text: "Has one day. Use it wisely." },
];

// ── True Ending ────────────────────────────────────────────

const DIALOGUE_TRUE_ENDING = [
  { speaker: 'narrator', text: "Vessa works through the night. The sisters, from the shore below, can see the glow of her loom through the tower window — it never dims." },
  { speaker: 'narrator', text: "At dawn she comes down. She carries the Crown wrapped in cloth that seems to be made of moonlight and patience." },
  { speaker: 'vessa', text: "It is done. The curse is lifted — I broke it when I finished the final stitch. Your mother is waking." },
  { speaker: 'cambrie', text: "How do you know?" },
  { speaker: 'vessa', text: "The Unraveling unravels when the maker chooses to heal it. I chose." },
  { speaker: 'narrator', text: "She hands the Crown to Mackenzie. It is the most beautiful thing either sister has ever seen. On the inner band, letters are woven in silver thread:" },
  { speaker: 'narrator', text: "'The Moonveil Crown, woven by Vessa of Elderwyn, in the Year of the Silver Moon. Let her name be known.'" },
  { speaker: 'mackenzie', text: "Let her name be known." },
  { speaker: 'cambrie', text: "We'll make it right. All of it." },
  { speaker: 'vessa', text: "I know. That's why I trusted you." },
];

const DIALOGUE_PALACE_RETURN = [
  { speaker: 'narrator', text: "The great hall of the Palace of Elderwyn, just after dawn on the seventh day." },
  { speaker: 'narrator', text: "Queen Elara sits up in her own bed for the first time in a week, threads whole, eyes clear. Birdie is crying. The physician is reciting facts about Thursdays. Nobody is listening." },
  { speaker: 'mackenzie', text: "Mother." },
  { speaker: 'narrator', text: "Elara looks at her daughters. Then at the Crown in Mackenzie's hands. Then at the name woven into the band." },
  { speaker: 'narrator', text: "'Vessa of Elderwyn.' She reads it quietly. Then again, louder." },
  { speaker: 'narrator', text: "The decree is signed before breakfast. The tapestry's inscription is restored in gold thread by the palace weaver. Three streets are renamed. It takes the rest of the week." },
  { speaker: 'narrator', text: "Cambrie writes all of it in her journal, in the careful ink she keeps for things worth remembering." },
  { speaker: 'narrator', text: "Mackenzie, for once, does not pace." },
];

const DIALOGUE_EPILOGUE = [
  { speaker: 'narrator', text: "Vessa of Elderwyn. Maker of the Moonveil Crown. Her name, once scratched from every record, restored to every one." },
  { speaker: 'narrator', text: "Dorian returned to his family, or what remained of it, forty years older than when he left." },
  { speaker: 'narrator', text: "Mira went back to the sea. She circles that stretch of coast still — joyfully, they say, in a way she hasn't in eleven years." },
  { speaker: 'narrator', text: "Thorn the goat published his collected works. He dedicated them to the fence post." },
  { speaker: 'narrator', text: "Wayne grilled fish and watched the water. Jennibelle fixed the fin herself, then sat beside him until dark. The duct tape finally gave out." },
  { speaker: 'narrator', text: "The sisters went home. The road back was the same road, walked by different people." },
];
