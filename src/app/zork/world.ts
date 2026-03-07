import type { Item, ItemId, Room, RoomId } from './types';

export const ITEMS: Record<ItemId, Item> = {
  ai_paper: {
    id: 'ai_paper',
    name: 'AI Research Paper',
    shortName: 'an AI research paper',
    description:
      'A dense academic paper titled "Generative AI in Enterprise Transformation." The margins are filled with annotations in gold ink. Author: J. Daniels. The abstract alone contains three citations to itself.',
    isBriefingDoc: true,
    takeable: true,
  },
  circuit_board: {
    id: 'circuit_board',
    name: 'Prototype Circuit Board',
    shortName: 'a prototype circuit board',
    description:
      'A green PCB stamped with the Lockheed Martin logo and the words "INTELLIGENT FACTORY — PROTOTYPE 1." It hums faintly, as if proud of itself. This is where Industry 4.0 began.',
    isBriefingDoc: true,
    takeable: true,
  },
  blockchain_key: {
    id: 'blockchain_key',
    name: 'Blockchain Ledger Key',
    shortName: 'a blockchain ledger key',
    description:
      'A matte-black USB drive engraved with a hash value. It contains the cryptographic keys to the first enterprise blockchain ledger ever deployed at Lockheed Martin. Worth considerably more than its weight in silicon.',
    isBriefingDoc: true,
    takeable: true,
  },
  lecture_notes: {
    id: 'lecture_notes',
    name: 'Cybersecurity Lecture Notes',
    shortName: 'a set of lecture notes',
    description:
      'Bound lecture notes for CSEC 650: Advanced Cybersecurity at UMGC. The cover reads: "Threats evolve. Defenders must evolve faster." Inside, generations of students have highlighted passages in every color of the spectrum.',
    isBriefingDoc: true,
    takeable: true,
  },
  cloud_cert: {
    id: 'cloud_cert',
    name: 'AWS GovCloud Certificate',
    shortName: 'an AWS GovCloud certificate',
    description:
      'A framed AWS certification plaque commemorating the first GreenGrass/IoT Core deployment on GovCloud. The inscription reads: "Where government meets the cloud, and neither blinks first."',
    isBriefingDoc: true,
    takeable: true,
  },
  keycard: {
    id: 'keycard',
    name: 'Security Keycard',
    shortName: 'a security keycard',
    description:
      'A red keycard marked TOP SECRET in embossed lettering. The magnetic stripe is worn smooth from use. Whatever it unlocks, it has been unlocked many times before.',
    isBriefingDoc: false,
    takeable: true,
  },
};

export const ROOMS: Record<RoomId, Room> = {
  antechamber: {
    id: 'antechamber',
    name: 'Digital Antechamber',
    description: `You are standing in a vast antechamber that exists at the intersection of several realities. The walls are lined with server racks that pulse with soft blue light. Holographic displays flicker with dashboards nobody is watching. A faint smell of recycled air and ambition fills the room.

A brass plaque on the wall reads: "ALL ROADS LEAD THROUGH HERE."

Exits lead north to a humming operations center, south toward a library, east into what sounds like industrial machinery, west toward the smell of coffee, and a ladder descends into darkness below.`,
    revisitDescription: `Digital Antechamber. Server racks pulse. Dashboards flicker. The brass plaque catches the light.`,
    exits: {
      north: { roomId: 'cloud_ops' },
      south: { roomId: 'archive' },
      east: { roomId: 'hangar' },
      west: { roomId: 'faculty' },
      down: { roomId: 'server_vault' },
    },
    initialItems: [],
    fixtures: {
      plaque: 'A brass plaque reads: "ALL ROADS LEAD THROUGH HERE." Words to live by.',
      racks: 'Row upon row of server racks, each one blinking with purposeful urgency. You resist the urge to reboot one just to see what happens.',
      displays: 'The holographic displays show dashboards for systems you do not recognize. Every metric is green. This is either very good or someone has tampered with the alerts.',
      ladder: 'A steel ladder descends into a dim chamber below. The rungs are well-worn.',
    },
  },

  cloud_ops: {
    id: 'cloud_ops',
    name: 'Cloud Operations Center',
    description: `You enter a room dominated by wall-to-wall monitoring screens, each displaying real-time metrics for AWS GovCloud regions spanning twelve time zones. The hum of precision air conditioning is almost musical.

A whiteboard near the entrance lists twelve AWS certifications. All boxes are checked. The pen is capped and resting on the ledge, as if waiting for a thirteenth.

Exits: south to the antechamber, north to a laboratory, east to a fortified bunker, west to a vault requiring clearance.`,
    revisitDescription: `Cloud Operations Center. Screens glow. Certifications checked. The pen waits.`,
    exits: {
      south: { roomId: 'antechamber' },
      north: { roomId: 'quantum_lab' },
      east: { roomId: 'bunker' },
      west: {
        roomId: 'blockchain_vault',
        requiresItem: 'keycard',
        lockedMessage:
          'A reinforced door blocks entry to the west. A card reader beside it flashes red. You need proper authorization.',
      },
    },
    initialItems: [],
    fixtures: {
      screens: 'Twelve AWS GovCloud regions, all green. The IoT Core and GreenGrass deployments appear to be performing flawlessly. As expected.',
      whiteboard: 'Twelve AWS certifications listed on the whiteboard, each with a green checkmark. Solutions Architect. DevOps Engineer. Security Specialty. The list goes on.',
      pen: 'A dry-erase marker, capped neatly on the whiteboard ledge. It has clearly earned a rest.',
      door: 'A reinforced steel door to the west. A card reader blinks red. To the east, a corridor leads toward the bunker.',
    },
  },

  quantum_lab: {
    id: 'quantum_lab',
    name: 'Quantum Computing Laboratory',
    description: `The lab is cold and humming. A quantum computer occupies the center of the room, suspended in a cryogenic housing that keeps it near absolute zero. The walls are lined with whiteboards covered in equations that look like they are trying to escape.

On a steel workbench: an AI research paper, covered in gold-ink annotations.

Exits: south.`,
    revisitDescription: `Quantum Computing Laboratory. Cold. Humming. Equations on every surface.`,
    exits: {
      south: { roomId: 'cloud_ops' },
    },
    initialItems: ['ai_paper'],
    fixtures: {
      computer: 'A quantum processor enclosed in a cryogenic housing. It operates at temperatures colder than deep space. You feel slightly inadequate by comparison.',
      whiteboards: 'Dense equations covering every whiteboard. You recognize a few from a graduate course you definitely took. Probably.',
      workbench: 'A steel workbench with an AI research paper on it, margins dense with gold-ink annotations.',
    },
  },

  blockchain_vault: {
    id: 'blockchain_vault',
    name: 'Blockchain Vault',
    description: `The vault is cool and smells of new hardware. The walls are inlaid with distributed ledger visualizations — chains of cryptographic blocks rendered in glowing amber. A single pedestal in the center holds a matte-black USB drive.

The inscription below the pedestal reads: "FIRST ENTERPRISE BLOCKCHAIN DEPLOYMENT — LOCKHEED MARTIN."

Exits: east.`,
    revisitDescription: `Blockchain Vault. Amber ledgers glow. The pedestal stands in the center.`,
    exits: {
      east: { roomId: 'cloud_ops' },
    },
    initialItems: ['blockchain_key'],
    fixtures: {
      ledger: 'The distributed ledger visualization covers the entire wall. Each block links to the next in an unbroken chain. Tamper-proof. Like good engineering should be.',
      pedestal: 'A black pedestal bearing a matte USB drive and an inscription: "FIRST ENTERPRISE BLOCKCHAIN DEPLOYMENT — LOCKHEED MARTIN."',
      inscription: 'The inscription reads: "FIRST ENTERPRISE BLOCKCHAIN DEPLOYMENT — LOCKHEED MARTIN." Beneath it, in smaller letters: "It took six months. It was worth it."',
    },
  },

  bunker: {
    id: 'bunker',
    name: 'Cybersecurity Bunker',
    description: `The bunker is spare and efficient — concrete walls, fluorescent lighting, and the kind of quiet that comes from having no network vulnerabilities. A threat intelligence dashboard covers one wall, its alerts sorted by severity.

On a hook beside the exit hangs a red security keycard marked TOP SECRET.

Exits: west.`,
    revisitDescription: `Cybersecurity Bunker. Concrete walls. Threat dashboard nominal. The hook is to your right.`,
    exits: {
      west: { roomId: 'cloud_ops' },
    },
    initialItems: ['keycard'],
    fixtures: {
      dashboard: 'The threat intelligence dashboard shows zero active incidents. Either the defenses are excellent or someone has disabled the alerts. You choose to believe the former.',
      hook: 'A steel hook beside the exit. A red keycard hangs from it.',
      walls: 'Concrete reinforced with rebar. No windows. No unnecessary surfaces. Just functionality.',
    },
  },

  hangar: {
    id: 'hangar',
    name: 'Aerospace Hangar',
    description: `The hangar is enormous — its ceiling lost in shadow, its floor marked with yellow safety lines. A partially assembled autonomous manufacturing system dominates the center. Robotic arms are frozen mid-gesture, waiting.

Near the assembly station, a prototype circuit board rests on a velvet display stand.

Exits: west.`,
    revisitDescription: `Aerospace Hangar. Robotic arms frozen. Yellow lines on the floor. The display stand catches the light.`,
    exits: {
      west: { roomId: 'antechamber' },
    },
    initialItems: ['circuit_board'],
    fixtures: {
      arms: 'Six robotic arms, each positioned over a different stage of the assembly process. They are powered down but seem alert, somehow.',
      system: 'The Intelligent Factory autonomous manufacturing system. Industry 4.0 made steel. The first of its kind.',
      stand: 'A velvet display stand holding a green PCB stamped "INTELLIGENT FACTORY — PROTOTYPE 1."',
      lines: 'Yellow safety lines on the floor delineate work zones with the precision of someone who has read every OSHA standard and enjoyed it.',
    },
  },

  faculty: {
    id: 'faculty',
    name: 'Faculty Lounge',
    description: `The lounge has the comfortable chaos of a room where ideas happen. Bookshelves cover every wall. A coffee machine that has clearly been through a great deal sits on a small table. On the main table, a stack of lecture notes sits next to a mug that reads "WORLD'S OKAYEST PROFESSOR" — ironic, given the accomplishments of whoever left it here.

The lecture notes are bound and labeled: CSEC 650.

Exits: east.`,
    revisitDescription: `Faculty Lounge. Books everywhere. Coffee machine in distress. The CSEC 650 notes on the table.`,
    exits: {
      east: { roomId: 'antechamber' },
    },
    initialItems: ['lecture_notes'],
    fixtures: {
      books: 'Hundreds of academic texts, arranged with a system only their owner understands. You spot titles on AI ethics, cloud security, enterprise architecture, and one mystery novel someone clearly needed.',
      coffee: 'The coffee machine makes a sound that suggests it is doing its best. You respect that.',
      mug: 'A ceramic mug reading "WORLD\'S OKAYEST PROFESSOR." The irony is thick enough to cut.',
      table: 'A well-worn faculty table with lecture notes and a coffee mug on it.',
    },
  },

  archive: {
    id: 'archive',
    name: 'Archive Library',
    description: `Floor-to-ceiling shelves of publications, patents, and project documentation. The air smells of old paper and institutional memory. A card catalog in the corner appears to be entirely handwritten.

A heavy door to the south bears a seal: EXECUTIVE COUNCIL CHAMBER — AUTHORIZED PERSONNEL ONLY.

Exits: north.`,
    revisitDescription: `Archive Library. Publications everywhere. The council chamber door to the south.`,
    exits: {
      north: { roomId: 'antechamber' },
      south: {
        roomId: 'council',
        lockedMessage:
          'The council chamber door is sealed. Its brass mechanism will not yield. Something tells you the briefing is not yet complete.',
      },
    },
    initialItems: [],
    fixtures: {
      shelves: 'Decades of publications, patents, and project documentation. The sheer volume of output is humbling.',
      catalog: 'A handwritten card catalog. Cross-referencing it would take weeks. You file this away as a future project.',
      door: 'A heavy steel door to the south. A brass seal reads: EXECUTIVE COUNCIL CHAMBER — AUTHORIZED PERSONNEL ONLY. The mechanism looks robust.',
      seal: 'The brass seal reads: EXECUTIVE COUNCIL CHAMBER — AUTHORIZED PERSONNEL ONLY. Beneath it, in small script: "Come prepared."',
    },
  },

  council: {
    id: 'council',
    name: 'Executive Council Chamber',
    description: `The chamber is grand and still. A long mahogany table runs the length of the room, flanked by high-backed chairs. At the far end, a raised podium stands beneath a single spotlight.

The words "PRESENT YOUR BRIEFING" are carved into the podium in gold lettering.

Exits: north.`,
    revisitDescription: `Executive Council Chamber. The mahogany table. The podium. The spotlight.`,
    exits: {
      north: { roomId: 'archive' },
    },
    initialItems: [],
    fixtures: {
      table: 'A mahogany table long enough to seat a board of directors, a senate subcommittee, or a very ambitious dinner party.',
      chairs: 'High-backed chairs, each positioned with expectation. The room is waiting for something.',
      podium: 'A raised podium with gold lettering: "PRESENT YOUR BRIEFING." A lectern light illuminates it from above.',
      spotlight: 'A single spotlight trained on the podium. Very dramatic. Whoever designed this room had opinions.',
    },
  },

  server_vault: {
    id: 'server_vault',
    name: 'Server Vault',
    description: `You descend the ladder into a cool, low-ceilinged vault. Blade servers fill every rack, their indicator lights creating a constellation of activity. The temperature is precisely calibrated. A framed plaque on the wall commemorates the AWS GovCloud deployment.

An AWS GovCloud certification plaque rests on a shelf beside the plaque.

Exits: up.`,
    revisitDescription: `Server Vault. Blade servers hum. The GovCloud plaque on the shelf.`,
    exits: {
      up: { roomId: 'antechamber' },
    },
    initialItems: ['cloud_cert'],
    fixtures: {
      servers: 'Blade servers filling every rack, their LEDs blinking in patterns too fast for human cognition. They are doing something important. They always are.',
      plaque: 'A wall plaque commemorates the first AWS GovCloud/GreenGrass/IoT Core deployment. The date is etched beneath a small AWS logo.',
      shelf: 'A shelf holding the AWS GovCloud certification plaque alongside a small, potted succulent that appears to be thriving.',
      succulent: 'A small succulent, improbably alive in a server vault. It seems content. You envy it slightly.',
    },
  },
};

export const BRIEFING_DOCS: ItemId[] = [
  'ai_paper',
  'circuit_board',
  'blockchain_key',
  'lecture_notes',
  'cloud_cert',
];
