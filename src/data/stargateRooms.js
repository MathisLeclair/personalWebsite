/**
 * Stargate Command – Cheyenne Mountain room data
 * Each room references its SVG <g> element id via `svgId`.
 * Screenshots live in public/stargate/screenshots/ (optional).
 */

export const rooms = [
    // ─── LEVEL 27 ────────────────────────────────────────────────────────────
    {
        id: 'l27-briefing',
        level: 27,
        svgId: 'room-briefing',
        name: 'Briefing Room',
        shortDesc: 'Where SG teams receive mission briefings from General Hammond.',
        longDesc:
            "The Briefing Room sits directly above the Control Room and is connected by a staircase to General Hammond's office. It features a large oval table where all active SG teams gather before and after missions. The room's large windows overlook the Stargate below, giving commanders a direct line of sight to the gate during activations. Critical decisions — including whether to engage alien threats, negotiate with new civilizations, or mount rescue operations — are made here.",
        screenshots: [
            '/stargate/screenshots/briefing-room-1.jpg',
            '/stargate/screenshots/briefing-room-2.jpg',
        ],
    },
    {
        id: 'l27-generals-office',
        level: 27,
        svgId: 'room-generals-office',
        name: "General's Office",
        shortDesc: 'Office of the SGC commanding officer, accessible from the Briefing Room.',
        longDesc:
            "The commanding officer's office is adjacent to the Briefing Room on Level 27. Occupied for most of the series by Major General George Hammond, the room serves as the administrative and command hub of the SGC. It features the general's desk, secure communication lines to the Pentagon and the President, and a personal window overlooking the Briefing Room. Later in the series it becomes the office of General Landry.",
        screenshots: [
            '/stargate/screenshots/generals-office-1.jpg',
        ],
    },
    {
        id: 'l27-corridor',
        level: 27,
        svgId: 'room-l27-corridor',
        name: 'Corridor (Level 27)',
        shortDesc: 'Main corridor connecting the stairways and offices on Level 27.',
        longDesc:
            "The corridor on Level 27 links the spiral staircase, elevator, Briefing Room, and General's office. Access is restricted to personnel with Level 27 clearance or higher. The corridor features the facility's characteristic color-coded lighting — white on this level, indicating high-security SGC administrative access.",
        screenshots: [],
    },
    {
        id: 'l27-spiral-stair',
        level: 27,
        svgId: 'room-l27-spiral-stair',
        name: 'Spiral Staircase',
        shortDesc: 'Internal staircase connecting Level 27 to Level 28.',
        longDesc:
            'The spiral staircase provides direct access between Level 27 (administrative) and Level 28 (gate operations). It is the quickest route from the Briefing Room down to the Control Room during emergencies. The design is a holdover from the original missile silo construction in the 1960s.',
        screenshots: [],
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
    {
        id: 'l27-security-station',
        level: 27,
        svgId: 'room-l27-security',
        name: 'Security Station',
        shortDesc: 'Level 27 security checkpoint controlling access to sensitive areas.',
        longDesc:
            'The security station on Level 27 monitors all entry and exit to the administrative section of the SGC. Armed SFs (Security Forces) maintain a 24-hour watch. All personnel must present valid ID and biometric credentials. The station is also equipped with an emergency lockdown control for isolating Level 27 from the rest of the complex.',
        screenshots: [],
    },

    // ─── LEVEL 28 ────────────────────────────────────────────────────────────
    {
        id: 'l28-gateroom',
        level: 28,
        svgId: 'room-gateroom',
        name: 'Gateroom (Gate Room)',
        shortDesc: 'The heart of the SGC — houses the Stargate and its ramp.',
        longDesc:
            'The Gateroom is the most iconic location in the SGC. It houses the recovered Ancient Stargate — a 6.7-metre ring of naquadah capable of forming stable wormholes to other planets across the galaxy. The room is dominated by the gate itself, mounted on a raised platform, with a metal ramp leading up to the event horizon. The ceiling retracts to allow the gate to be raised via a crane into the missile silo shaft above. Blast doors protect the control room and adjacent areas when the gate activates. The room is kept under constant armed guard.',
        screenshots: [
            '/stargate/screenshots/gateroom-1.jpg',
            '/stargate/screenshots/gateroom-2.jpg',
            '/stargate/screenshots/gateroom-3.jpg',
        ],
    },
    {
        id: 'l28-control-room',
        level: 28,
        svgId: 'room-control',
        name: 'Control Room',
        shortDesc: 'Glass-windowed operations room overlooking the Stargate.',
        longDesc:
            'Positioned one level above the Gateroom with large reinforced windows, the Control Room is where Sgt. Walter Harriman (and others) operates the dialing computer and monitors all gate activity. The room contains the DHD (Dial-Home Device) computer interface, incoming/outgoing wormhole confirmation systems, and sensor readouts. General Hammond and later General Landry frequently observe gate activations from this room. It is connected directly to the Briefing Room above via the internal staircase.',
        screenshots: [
            '/stargate/screenshots/control-room-1.jpg',
            '/stargate/screenshots/control-room-2.jpg',
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
        svgId: 'room-laboratory',
        name: 'Laboratory',
        shortDesc: 'Scientific analysis lab for studying alien artefacts and technology.',
        longDesc:
            "The laboratory on Level 28 is primarily used by Dr. Daniel Jackson, Dr. Samantha Carter, and visiting scientists to analyse alien artefacts, biological samples, and recovered technology brought back through the Stargate. It contains advanced spectrographic, chemical, and electronic analysis equipment. Several major discoveries — including decoding Ancient tablet inscriptions and reverse-engineering Goa'uld technology — took place here.",
        screenshots: [
            '/stargate/screenshots/lab-1.jpg',
        ],
    },
    {
        id: 'l28-observation',
        level: 28,
        svgId: 'room-observation',
        name: 'Observation Deck',
        shortDesc: 'Secondary observation point overlooking the Gateroom from ground level.',
        longDesc:
            'The Observation Deck provides a ground-level viewing area for the Gateroom, separate from the elevated Control Room window. It is used during VIP visits, diplomatic meetings, or when additional personnel need to monitor gate operations without crowding the Control Room. Government officials, Pentagon liaisons, and alien allies have observed gate activations from this position.',
        screenshots: [],
    },
    {
        id: 'l28-round-hallway',
        level: 28,
        svgId: 'room-round-hallway',
        name: 'Round Hallway',
        shortDesc: 'Curved corridor linking major Level 28 sections.',
        longDesc:
            'The Round Hallway is a distinctive curved corridor that connects the main Level 28 areas — the Control Room, Gateroom approach, and the tunnel corridor leading to the elevators and armory. Its rounded shape is an architectural feature of the original missile silo construction. It is frequently seen in chase sequences and tense confrontations throughout the series.',
        screenshots: [],
    },
    {
        id: 'l28-tunnel-corridor',
        level: 28,
        svgId: 'room-tunnel-corridor',
        name: 'Tunnel Corridor',
        shortDesc: 'Access tunnel connecting the mountain entrance to the main facility.',
        longDesc:
            "The tunnel corridor is the primary access route between the mountain's vehicle entrance and the interior of the SGC. Personnel and equipment entering the facility pass through here, and it is the first line of defence against ground assault. The tunnel features color-coded lighting (white on Level 28) and is lined with security checkpoints, blast barriers, and monitored by multiple camera systems.",
        screenshots: [],
    },
    {
        id: 'l28-elevator',
        level: 28,
        svgId: 'room-l28-elevator',
        name: 'Elevator (Level 28)',
        shortDesc: 'Elevator access point on the deepest operational level of the SGC.',
        longDesc:
            'The elevator access point on Level 28 connects the Stargate operations level to all other sublevels of Cheyenne Mountain. It is the route taken by SG teams arriving from the surface and by any personnel transitioning between the administrative and operational levels. The elevator is subject to a complete lockdown during a base-wide emergency.',
        screenshots: [],
    },
    {
        id: 'l28-corridor',
        level: 28,
        svgId: 'room-l28-corridor',
        name: 'Corridor (Level 28)',
        shortDesc: 'Main corridor on Level 28 connecting all operational areas.',
        longDesc:
            'The corridors of Level 28 link every major room on the operational floor — the Gateroom, Control Room, Laboratory, Observation Deck, and elevator. They feature the white tunnel lighting characteristic of the high-security SGC sublevels. Many dramatic scenes of SG-1 sprinting to the gate, escorting wounded team members, or facing down alien incursions take place in these corridors.',
        screenshots: [],
    },
    {
        id: 'l28-spiral-stair',
        level: 28,
        svgId: 'room-l28-spiral-stair',
        name: 'Spiral Staircase (Level 28)',
        shortDesc: 'Internal staircase connecting Level 28 up to Level 27.',
        longDesc:
            'The spiral staircase on Level 28 mirrors the one above on Level 27 and provides a secondary route (besides the elevator) between the gate operations floor and the administrative level. It is frequently used in the series when the elevator is under lockdown or when speed is essential.',
        screenshots: [],
    },
    {
        id: 'l28-armory',
        level: 28,
        svgId: 'room-armory',
        name: 'Armory',
        shortDesc: 'Equipment and weapons storage for SG teams.',
        longDesc:
            'The armory on Level 28 is where SG teams collect their mission loadouts — weapons, tactical vests, communications equipment, and alien technology cleared for field use. It is stocked with standard USAF weapons (P90s, MP5s, M9 sidearms) as well as recovered alien devices. The armory is managed by the base quartermaster and requires mission authorization to access before a gate departure.',
        screenshots: [
            '/stargate/screenshots/armory-1.jpg',
        ],
    },
]

export const getRoomsByLevel = (level) => rooms.filter((r) => r.level === level)
export const getRoomById = (id) => rooms.find((r) => r.id === id)
