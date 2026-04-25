/**
 * Stargate Command – Cheyenne Mountain room data
 * Each room references its SVG <g> element id via `svgId`.
 * Screenshots live in public/stargate/screenshots/ (optional).
 */

export const rooms = [
    // ─── LEVEL 27 ────────────────────────────────────────────────────────────
    {
        id: 'l27-briefing-room',
        level: 27,
        svgId: 'room-l27-briefing-room',
        name: 'Briefing Room',
        shortDesc: 'Where SG teams receive mission briefings from General Hammond.',
        longDesc:
            "The Briefing Room sits directly above the Control Room and is connected by a staircase to General Hammond's office. It features a large oval table where all active SG teams gather before and after missions. The room's large windows overlook the Stargate below, giving commanders a direct line of sight to the gate during activations. Critical decisions — including whether to engage alien threats, negotiate with new civilizations, or mount rescue operations — are made here.",
        screenshots: [
            '/stargate/screenshots/briefing-room-1.png',
            '/stargate/screenshots/briefing-room-2.jpg',
            '/stargate/screenshots/briefing-room-3.jpg',
        ],
    },
    {
        id: 'l27-generals-office',
        level: 27,
        svgId: 'room-l27-generals-office',
        name: "General's Office",
        shortDesc: 'Office of the SGC commanding officer, accessible from the Briefing Room.',
        longDesc:
            "The commanding officer's office is adjacent to the Briefing Room on Level 27. Occupied for most of the series by Major General George Hammond, the room serves as the administrative and command hub of the SGC. It features the general's desk, secure communication lines to the Pentagon and the President, and a personal window overlooking the Briefing Room. Later in the series it becomes the office of General Landry.",
        screenshots: [
            '/stargate/screenshots/generals-office-1.png',
        ],
    },
    {
        id: 'l27-elevator',
        level: 27,
        svgId: 'room-l27-elevator',
        name: 'Elevator',
        shortDesc: 'Main elevator shaft serving all 28 sublevels of Cheyenne Mountain.',
        longDesc:
            'The elevator system connects all 28 sublevels of the Cheyenne Mountain Complex. The upper levels (1–6) are accessible to general military and civilian personnel, while deeper sublevels require progressively higher security clearances. The elevator is the primary transit point for personnel, equipment, and — occasionally — alien visitors under escort.',
        screenshots: [],
    },

    // ─── LEVEL 28 ────────────────────────────────────────────────────────────
    {
        id: 'l28-gateroom',
        level: 28,
        svgId: 'room-l28-gateroom',
        name: 'Gate Room',
        shortDesc: 'The heart of the SGC — houses the Stargate and its ramp.',
        longDesc:
            'The Gateroom is the most iconic location in the SGC. It houses the recovered Ancient Stargate — a 6.7-metre ring of naquadah capable of forming stable wormholes to other planets across the galaxy. The room is dominated by the gate itself, mounted on a raised platform, with a metal ramp leading up to the event horizon. The ceiling retracts to allow the gate to be raised via a crane into the missile silo shaft above. Blast doors protect the control room and adjacent areas when the gate activates. The room is kept under constant armed guard.',
        screenshots: [
            '/stargate/screenshots/gateroom-1.png',
            '/stargate/screenshots/gateroom-2.png',
            '/stargate/screenshots/gateroom-3.png',
            '/stargate/screenshots/gateroom-4.png',
        ],
    },
    {
        id: 'l28-control-room',
        level: 28,
        svgId: 'room-l28-control-room',
        name: 'Control Room',
        shortDesc: 'Glass-windowed operations room overlooking the Stargate.',
        longDesc:
            'Positioned one level above the Gateroom with large reinforced windows, the Control Room is where Sgt. Walter Harriman (and others) operates the dialing computer and monitors all gate activity. The room contains the DHD (Dial-Home Device) computer interface, incoming/outgoing wormhole confirmation systems, and sensor readouts. General Hammond and later General Landry frequently observe gate activations from this room. It is connected directly to the Briefing Room above via the internal staircase.',
        screenshots: [
            '/stargate/screenshots/control-room-1.png',
        ],
    },
    {
        id: 'l28-blast-door',
        level: 28,
        svgId: 'room-blast-door',
        name: 'Blast Door',
        shortDesc: 'Massive reinforced doors protecting the interior from gate energy.',
        longDesc:
            'The blast doors are the primary defensive mechanism protecting the SGC interior from an unstable gate activation or incoming hostile forces. They are made of thick reinforced steel and titanium composite, capable of withstanding a direct energy weapon discharge. The doors seal automatically when the iris is closed and during red alert conditions. A secondary set of blast doors also exists at the entrance tunnel.',
        screenshots: [
            '/stargate/screenshots/blast-door-1.jpg',
        ],
    },
    {
        id: 'l28-ramp',
        level: 28,
        svgId: 'room-ramp',
        name: 'Ramp',
        shortDesc: 'The metal ramp leading up to the Stargate event horizon.',
        longDesc:
            'The ramp is the final few metres of Earth that departing SG teams walk before stepping through the Stargate. Made of a non-reactive metal alloy, it leads directly from the Gateroom floor up to the event horizon. Teams departing on missions and travellers arriving from other worlds all pass over this ramp. Over the course of the show it becomes one of the most symbolically significant locations in the series.',
        screenshots: [
            '/stargate/screenshots/ramp-1.jpg',
        ],
    },
    {
        id: 'l28-laboratory',
        level: 28,
        svgId: 'room-l28-laboratory',
        name: 'Laboratory',
        shortDesc: 'Scientific analysis lab for studying alien artefacts and technology.',
        longDesc:
            "The laboratory on Level 28 is primarily used by Dr. Daniel Jackson, Dr. Samantha Carter, and visiting scientists to analyse alien artefacts, biological samples, and recovered technology brought back through the Stargate. It contains advanced spectrographic, chemical, and electronic analysis equipment. Several major discoveries — including decoding Ancient tablet inscriptions and reverse-engineering Goa'uld technology — took place here.",
        screenshots: [],
    },
    {
        id: 'l28-observation-deck',
        level: 28,
        svgId: 'room-l28-observation-deck',
        name: 'Observation Deck',
        shortDesc: 'Secondary observation point overlooking the Gateroom from ground level.',
        longDesc:
            'The Observation Deck provides a ground-level viewing area for the Gateroom, separate from the elevated Control Room window. It is used during VIP visits, diplomatic meetings, or when additional personnel need to monitor gate operations without crowding the Control Room. Government officials, Pentagon liaisons, and alien allies have observed gate activations from this position.',
        screenshots: [],
    },
    {
        id: 'l28-staging-room',
        level: 28,
        svgId: 'room-l28-staging-room',
        name: 'Staging Room',
        shortDesc: 'Pre-mission assembly area adjacent to the Gateroom.',
        longDesc:
            'The Staging Room is where SG teams form up immediately before gate departure. Final equipment checks, last-minute briefings, and pre-mission medical clearances happen here. It sits directly between the main corridor and the Gateroom blast doors, making it the last controlled space before personnel step through the wormhole.',
        screenshots: [],
    },
    {
        id: 'l28-toilets',
        level: 28,
        svgId: 'room-l28-toilets',
        name: 'Restrooms',
        shortDesc: 'Level 28 restroom facilities.',
        longDesc: 'Standard SGC restroom facilities on Level 28.',
        screenshots: [],
    },
    {
        id: 'l28-round-hallway',
        level: 28,
        svgId: 'room-l28-round-hallway',
        name: 'Round Hallway',
        shortDesc: 'Curved corridor linking major Level 28 sections.',
        longDesc:
            'The Round Hallway is a distinctive curved corridor that connects the main Level 28 areas — the Control Room, Gateroom approach, and the tunnel corridor leading to the elevators and armory. Its rounded shape is an architectural feature of the original missile silo construction. It is frequently seen in chase sequences and tense confrontations throughout the series.',
        screenshots: [
            '/stargate/screenshots/round-hallway-1.png',
            '/stargate/screenshots/round-hallway-2.jpg',
        ],
    },
    {
        id: 'l28-elevator-surface',
        level: 28,
        svgId: 'room-l28-elevator-surface',
        name: 'Elevator to Surface',
        shortDesc: 'Left elevator shaft — direct access to the surface of Cheyenne Mountain.',
        longDesc:
            'This elevator connects Level 28 directly to the surface of Cheyenne Mountain. It is the primary route for SG teams arriving from or departing to the outside world, and for supply runs and VIP transfers. During lockdown, this shaft is sealed and guarded at both ends.',
        screenshots: [
            '/stargate/screenshots/elevator-surface-1.jpg',
        ],
    },
    {
        id: 'l28-elevator-l27',
        level: 28,
        svgId: 'room-l28-elevator-l27',
        name: 'Elevator to Level 27',
        shortDesc: 'Right elevator shaft — connects Level 28 to Level 27 and upper sublevels.',
        longDesc:
            'This elevator provides transit between the gate operations floor (Level 28) and the administrative level above (Level 27), as well as all other sublevels of the complex. It is the standard route taken by personnel moving between the Briefing Room, General\'s Office, and the Gateroom.',
        screenshots: [],
    },
    {
        id: 'l28-outer-corridor',
        level: 28,
        svgId: 'room-l28-outer-corridor',
        name: 'Outer Corridor',
        shortDesc: 'Perimeter corridor running around the full outside of Level 28.',
        longDesc:
            'The outer corridor forms the full perimeter of Level 28, wrapping around the Gateroom, Control Room, and all adjacent sections. It serves as the primary access route for security patrols, emergency egress, and logistics movement between sections without passing through the high-security interior rooms. Multiple blast doors and security checkpoints segment the corridor during lockdown.',
        screenshots: [],
    },
]

export const getRoomsByLevel = (level) => rooms.filter((r) => r.level === level)
export const getRoomById = (id) => rooms.find((r) => r.id === id)
