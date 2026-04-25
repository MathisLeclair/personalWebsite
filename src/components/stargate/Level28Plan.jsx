/**
 * Level 28 Floor Plan – SGC Cheyenne Mountain
 *
 * Layout based on user-confirmed English official reference:
 *
 *   [STAIR circ][CONTROL ROOM (same width as gateroom)][TUNNEL][ROUND HALLWAY][ARMORY][ELEV]
 *              [GATEROOM (large, lower-left)           ][STAGING AREA  ][CONN][CORR  ][    ]
 *              [                                       ][              ][LAB ][OBS   ][    ]
 *              [BOTTOM CORRIDOR                                                       ][    ]
 *
 * Staircase protrudes as a circular alcove from the left wall.
 * viewBox 0 0 1040 600
 */

const W = '#4fc3f7'
const FILL_D = 'rgba(79,195,247,0.08)'
const FILL_H = 'rgba(79,195,247,0.22)'
const FILL_S = 'rgba(79,195,247,0.36)'
const TXT = '#b3e5fc'
const BG = '#050d1a'

// ─── Helpers ────────────────────────────────────────────────────────────────

function Lbl({ x, y, lines, size = 10 }) {
  return lines.map((l, i) => (
    <text
      key={i} x={x} y={y + i * 13}
      textAnchor="middle" fill={TXT} fontSize={size}
      fontFamily="'Inter',sans-serif"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
      opacity={0.9}
    >{l}</text>
  ))
}

function Wall({ x1, y1, x2, y2, t = 3 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={W} strokeWidth={t} strokeLinecap="square" />
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Level28Plan({ selectedRoom, onRoomSelect }) {
  const sel  = id => selectedRoom === id
  const fill = id => sel(id) ? FILL_S : FILL_D
  const clk  = id => () => onRoomSelect(id)

  // ── Key coordinates ──────────────────────────────────────────────────────
  //
  // X columns
  const lw   = 80   // left wall / staircase circle cx
  const grr  = 460  // gateroom + control room right wall
  const tcr  = 560  // tunnel corridor right wall
  const rhcx = 650  // round hallway circle center x
  const rhr  = 87   // round hallway radius  →  right edge x = 737
  const arml = 737  // armory left  =  rhcx + rhr
  const conr = 760  // connector right / lab right / outer-corr left
  const cr   = 880  // outer-corr right / obs-deck right / elevator left
  const er   = 960  // building right wall

  // Y rows
  const t    = 30   // building top
  const cb   = 205  // control-room bottom / gateroom top
  const mid  = 350  // connector bottom / lab top (T-junction split)
  const gb   = 490  // gateroom bottom / staging bottom / rooms bottom
  const bb   = 570  // building bottom

  // Staircase circle (protrudes left from left wall)
  const scy  = 130  // staircase circle center y
  const sr   = 68   // staircase radius  →  top y=62, bottom y=198, left x=12

  // ── Building footprint path (rectangular + circular staircase bump) ───────
  //  Walk: top → right → bottom → left (up to staircase) → arc LEFT → continue up
  const bldgPath =
    `M ${lw},${t} ` +
    `L ${er},${t} L ${er},${bb} L ${lw},${bb} ` +
    `L ${lw},${scy + sr} ` +
    `A ${sr},${sr},0,0,0,${lw},${scy - sr} ` +
    `L ${lw},${t} Z`

  return (
    <svg
      viewBox="0 0 1040 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="SGC Level 28 Floor Plan"
    >
      <defs>
        <filter id="l28glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="l28dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.55" fill={W} opacity="0.18" />
        </pattern>
        <style>{`
          .l28r { cursor: pointer; }
          .l28r .f { transition: fill 0.18s ease; }
          .l28r:hover .f { fill: ${FILL_H}; }
        `}</style>
      </defs>

      {/* ── Background ── */}
      <rect width="1040" height="600" fill={BG} />
      <path d={bldgPath} fill="url(#l28dots)" />

      {/* ════════════════════════════════════════════════════════════════
          ROOM FILLS  (top row first, then bottom row)
      ════════════════════════════════════════════════════════════════ */}

      {/* ── Spiral Staircase – circular alcove protruding left from wall ── */}
      <g id="room-l28-spiral-stair" className="l28r" onClick={clk('l28-spiral-stair')}>
        <circle className="f" cx={lw} cy={scy} r={sr} fill={fill('l28-spiral-stair')} />
        <circle cx={lw} cy={scy} r={52} fill="none" stroke={W} strokeWidth={0.8} opacity={0.28} />
        <circle cx={lw} cy={scy} r={36} fill="none" stroke={W} strokeWidth={0.8} opacity={0.22} />
        <circle cx={lw} cy={scy} r={20} fill="none" stroke={W} strokeWidth={0.7} opacity={0.18} />
        <line x1={lw - 60} y1={scy} x2={lw + 60} y2={scy} stroke={W} strokeWidth={0.6} opacity={0.18} />
        <line x1={lw} y1={scy - 60} x2={lw} y2={scy + 60} stroke={W} strokeWidth={0.6} opacity={0.18} />
        <Lbl x={lw + 20} y={scy - 8} lines={['Spiral', 'Stair']} size={9} />
      </g>

      {/* ── Control Room (above gateroom, same width) ── */}
      <g id="room-control" className="l28r" onClick={clk('l28-control-room')}>
        <rect className="f" x={lw} y={t} width={grr - lw} height={cb - t} fill={fill('l28-control-room')} />
        {/* DHD console bank */}
        <rect x={170} y={68} width={220} height={42} rx={3} fill="none" stroke={W} strokeWidth={0.9} opacity={0.35} />
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={176 + i * 42} y={74} width={30} height={30} rx={2}
            fill="none" stroke={W} strokeWidth={0.6} opacity={0.22} />
        ))}
        {/* Observation window ledge (overlooks gateroom below) */}
        <rect x={lw + 5} y={cb - 11} width={grr - lw - 10} height={8}
          fill="none" stroke={W} strokeWidth={1.5} opacity={0.65} />
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={i}
            x1={lw + 22 + i * 50} y1={cb - 11}
            x2={lw + 22 + i * 50} y2={cb - 3}
            stroke={W} strokeWidth={0.8} opacity={0.45} />
        ))}
        <Lbl x={270} y={45} lines={['Control Room']} />
      </g>

      {/* ── Tunnel Corridor (horizontal, connecting Control Room → Round Hallway) ── */}
      <g id="room-tunnel-corridor" className="l28r" onClick={clk('l28-tunnel-corridor')}>
        <rect className="f" x={grr} y={t} width={tcr - grr} height={cb - t}
          fill={fill('l28-tunnel-corridor')} />
        {/* Tunnel light fixtures */}
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={grr + 8} y={t + 16 + i * 32} width={tcr - grr - 16} height={14} rx={2}
            fill="none" stroke={W} strokeWidth={0.6} opacity={0.18} />
        ))}
        <Lbl x={(grr + tcr) / 2} y={110} lines={['Tunnel', 'Corr.']} size={9} />
      </g>

      {/* ── Round Hallway (circular room, right of tunnel corridor) ── */}
      <g id="room-round-hallway" className="l28r" onClick={clk('l28-round-hallway')}>
        <circle className="f" cx={rhcx} cy={117} r={rhr} fill={fill('l28-round-hallway')} />
        <circle cx={rhcx} cy={117} r={74} fill="none" stroke={W} strokeWidth={0.7} opacity={0.22} />
        <circle cx={rhcx} cy={117} r={52} fill="none" stroke={W} strokeWidth={0.6} opacity={0.16} />
        <Lbl x={rhcx} y={111} lines={['Round', 'Hallway']} size={9} />
      </g>

      {/* ── Armory (upper right, right of round hallway) ── */}
      <g id="room-armory" className="l28r" onClick={clk('l28-armory')}>
        <rect className="f" x={arml} y={t} width={cr - arml} height={cb - t}
          fill={fill('l28-armory')} />
        {/* Weapon rack shelves */}
        {[0, 1].map(i => (
          <rect key={i} x={arml + 12} y={t + 18 + i * 62} width={cr - arml - 24} height={44} rx={2}
            fill="none" stroke={W} strokeWidth={0.7} opacity={0.28} />
        ))}
        <Lbl x={(arml + cr) / 2} y={(t + cb) / 2 + 4} lines={['Armory']} />
      </g>

      {/* ── Elevator (far right, full height) ── */}
      <g id="room-l28-elevator" className="l28r" onClick={clk('l28-elevator')}>
        <rect className="f" x={cr} y={t} width={er - cr} height={bb - t}
          fill={fill('l28-elevator')} />
        <rect x={cr + 12} y={190} width={er - cr - 24} height={56} rx={4}
          fill="none" stroke={W} strokeWidth={1} opacity={0.4} />
        <text x={(cr + er) / 2} y={223} textAnchor="middle" fill={TXT} fontSize={20}
          fontFamily="'Inter',sans-serif"
          style={{ pointerEvents: 'none', userSelect: 'none' }} opacity={0.35}>↕</text>
        <Lbl x={(cr + er) / 2} y={110} lines={['Elev.']} size={9} />
      </g>

      {/* ── Gateroom (large, lower-left) ── */}
      <g id="room-gateroom" className="l28r" onClick={clk('l28-gateroom')}>
        <rect className="f" x={lw} y={cb} width={grr - lw} height={gb - cb}
          fill={fill('l28-gateroom')} />
        {/* Stargate ring */}
        <circle cx={248} cy={332} r={74} fill="none" stroke={W} strokeWidth={2.5}
          opacity={0.72} filter="url(#l28glow)" />
        <circle cx={248} cy={332} r={62} fill="none" stroke={W} strokeWidth={0.7} opacity={0.22} />
        {/* 9 Chevrons */}
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i * 40 - 90) * Math.PI / 180
          return <circle key={i}
            cx={248 + 68 * Math.cos(a)} cy={332 + 68 * Math.sin(a)}
            r={5.5} fill={W} opacity={0.62} />
        })}
        <text x={248} y={328} textAnchor="middle" fill={TXT} fontSize={8}
          fontFamily="'Inter',sans-serif"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          opacity={0.65} letterSpacing="1.5">STARGATE</text>
        {/* Ramp trapezoid */}
        <polygon points="220,414 276,414 292,452 204,452"
          fill="none" stroke={W} strokeWidth={1.1} opacity={0.5} />
        <text x={248} y={444} textAnchor="middle" fill={TXT} fontSize={8}
          fontFamily="'Inter',sans-serif"
          style={{ pointerEvents: 'none', userSelect: 'none' }} opacity={0.5}>ramp</text>
        <Lbl x={143} y={328} lines={['Gate', 'Room']} />
      </g>

      {/* ── Ramp (separate clickable element) ── */}
      <g id="room-ramp" className="l28r" onClick={clk('l28-ramp')}>
        <polygon className="f" points="214,407 282,407 300,458 196,458"
          fill={fill('l28-ramp')} opacity={0.55} />
      </g>

      {/* ── Blast Door (between gateroom right wall and staging area) ── */}
      <g id="room-blast-door" className="l28r" onClick={clk('l28-blast-door')}>
        <rect className="f" x={grr - 8} y={345} width={16} height={100}
          fill={fill('l28-blast-door')} />
        {/* Blast door hatch marks */}
        {[0,1,2,3,4].map(i => (
          <line key={i}
            x1={grr - 8} y1={350 + i * 18}
            x2={grr + 8} y2={362 + i * 18}
            stroke={W} strokeWidth={1} opacity={0.55} />
        ))}
        <text x={grr} y={404} textAnchor="middle" fill={TXT} fontSize={7}
          transform="rotate(-90, 462, 395)"
          fontFamily="'Inter',sans-serif"
          style={{ pointerEvents: 'none', userSelect: 'none' }} opacity={0.5}>BLAST DOOR</text>
      </g>

      {/* ── Staging Area (left branch of T, between round hallway and gateroom) ── */}
      <g id="room-staging" className="l28r" onClick={clk('l28-round-hallway')}>
        <rect className="f" x={grr} y={cb} width={tcr + 100 - grr} height={gb - cb}
          fill={fill('l28-round-hallway')} opacity={0.8} />
        {/* Down-stem path indicator (from round hallway above) */}
        <line x1={(grr + tcr + 100) / 2} y1={cb}
              x2={(grr + tcr + 100) / 2} y2={cb + 90}
          stroke={W} strokeWidth={1} strokeDasharray="7,5" opacity={0.28} />
        <Lbl x={(grr + tcr + 100) / 2} y={370} lines={['Staging', 'Area']} size={9} />
      </g>

      {/* ── Connector Room (right branch of T) ── */}
      <g id="room-connector" className="l28r" onClick={clk('l28-corridor')}>
        <rect className="f" x={tcr + 100} y={cb} width={conr - (tcr + 100)} height={mid - cb}
          fill={fill('l28-corridor')} opacity={0.85} />
        <Lbl x={(tcr + 100 + conr) / 2} y={(cb + mid) / 2 + 4} lines={['Conn.']} size={9} />
      </g>

      {/* ── Laboratory (lower center-right) ── */}
      <g id="room-laboratory" className="l28r" onClick={clk('l28-laboratory')}>
        <rect className="f" x={tcr + 100} y={mid} width={conr - (tcr + 100)} height={gb - mid}
          fill={fill('l28-laboratory')} />
        <rect x={tcr + 110} y={mid + 18} width={conr - (tcr + 100) - 20} height={26} rx={2}
          fill="none" stroke={W} strokeWidth={0.7} opacity={0.3} />
        <rect x={tcr + 110} y={mid + 55} width={conr - (tcr + 100) - 20} height={26} rx={2}
          fill="none" stroke={W} strokeWidth={0.7} opacity={0.25} />
        <Lbl x={(tcr + 100 + conr) / 2} y={(mid + gb) / 2 + 4} lines={['Lab']} size={9} />
      </g>

      {/* ── Outer Corridor (vertical, right of connector) ── */}
      <g id="room-l28-corridor" className="l28r" onClick={clk('l28-corridor')}>
        <rect className="f" x={conr} y={cb} width={cr - conr} height={mid - cb}
          fill={fill('l28-corridor')} />
        <line x1={(conr + cr) / 2} y1={cb + 10} x2={(conr + cr) / 2} y2={mid - 10}
          stroke={W} strokeWidth={0.8} strokeDasharray="8,7" opacity={0.2} />
        <Lbl x={(conr + cr) / 2} y={(cb + mid) / 2 + 4} lines={['Corr.']} size={9} />
      </g>

      {/* ── Observation Deck (lower right) ── */}
      <g id="room-observation" className="l28r" onClick={clk('l28-observation')}>
        <rect className="f" x={conr} y={mid} width={cr - conr} height={gb - mid}
          fill={fill('l28-observation')} />
        <Lbl x={(conr + cr) / 2} y={(mid + gb) / 2 + 4} lines={['Obs.', 'Deck']} size={9} />
      </g>

      {/* ── Bottom Corridor (full width horizontal) ── */}
      <g id="room-bottom-corr" className="l28r" onClick={clk('l28-corridor')}>
        <rect className="f" x={lw} y={gb} width={cr - lw} height={bb - gb}
          fill={fill('l28-corridor')} opacity={0.75} />
        <line x1={lw + 12} y1={(gb + bb) / 2} x2={cr - 12} y2={(gb + bb) / 2}
          stroke={W} strokeWidth={0.8} strokeDasharray="10,8" opacity={0.2} />
        <Lbl x={(lw + cr) / 2} y={(gb + bb) / 2 + 4} lines={['Bottom Corridor']} size={9} />
      </g>

      {/* ════════════════════════════════════════════════════════════════
          WALL LINES  (drawn on top of fills)
      ════════════════════════════════════════════════════════════════ */}

      {/* Building outer boundary */}
      <path d={bldgPath} fill="none" stroke={W} strokeWidth={3} />

      {/* ── Interior horizontal walls ── */}
      {/* Control Room / Gateroom boundary (+ window ledge already drawn) */}
      <Wall x1={lw} y1={cb} x2={grr} y2={cb} />
      {/* Top row bottom boundary (right section) */}
      <Wall x1={grr} y1={cb} x2={arml} y2={cb} />
      <Wall x1={arml} y1={cb} x2={cr} y2={cb} />
      {/* mid-level split (connector / lab / outer-corr / obs-deck) */}
      <Wall x1={tcr + 100} y1={mid} x2={cr} y2={mid} />
      {/* Gateroom / bottom corridor */}
      <Wall x1={lw} y1={gb} x2={cr} y2={gb} />

      {/* ── Interior vertical walls ── */}
      {/* Control Room right / Tunnel Corridor left */}
      <Wall x1={grr} y1={t} x2={grr} y2={cb} />
      {/* Gateroom right / Staging Area left (minus blast door gap) */}
      <Wall x1={grr} y1={cb} x2={grr} y2={340} />
      <Wall x1={grr} y1={448} x2={grr} y2={gb} />
      {/* Tunnel Corridor right / Round Hallway boundary */}
      <Wall x1={tcr} y1={t} x2={tcr} y2={cb} />
      {/* Armory left / Round Hallway right area */}
      <Wall x1={arml} y1={t} x2={arml} y2={cb} />
      {/* Armory right / Elevator left */}
      <Wall x1={cr} y1={t} x2={cr} y2={bb} />
      {/* Staging Area / Connector boundary (full height lower section) */}
      <Wall x1={tcr + 100} y1={cb} x2={tcr + 100} y2={gb} />
      {/* Connector-Lab right / Outer Corridor-Obs left */}
      <Wall x1={conr} y1={cb} x2={conr} y2={gb} />

      {/* ── Blast door symbol on gateroom right wall ── */}
      <line x1={grr - 1} y1={340} x2={grr - 1} y2={448}
        stroke="#ffd54f" strokeWidth={4} opacity={0.7} />

      {/* ── Round Hallway outer ring (wall outline) ── */}
      <circle cx={rhcx} cy={117} r={rhr}
        fill="none" stroke={W} strokeWidth={3} />

      {/* ── Staircase outer ring ── */}
      <circle cx={lw} cy={scy} r={sr}
        fill="none" stroke={W} strokeWidth={3} />
      {/* Opening in left wall at the staircase (doorway arc) */}
      <line x1={lw - 1} y1={scy - sr + 4} x2={lw - 1} y2={scy + sr - 4}
        stroke={BG} strokeWidth={5} />
      {/* Staircase wall connecting to control room (right side of circle) */}
      <line x1={lw + sr - 4} y1={scy - 14} x2={lw + sr - 4} y2={scy + 14}
        stroke={W} strokeWidth={3} />

      {/* ════════════════════════════════════════════════════════════════
          ROOM LABELS (positioned last so they render on top)
      ════════════════════════════════════════════════════════════════ */}

      {/* Scale bar */}
      <g opacity={0.5}>
        <line x1={90} y1={555} x2={190} y2={555} stroke={W} strokeWidth={1.2} />
        <line x1={90} y1={550} x2={90} y2={560} stroke={W} strokeWidth={1.2} />
        <line x1={140} y1={550} x2={140} y2={560} stroke={W} strokeWidth={1.2} />
        <line x1={190} y1={550} x2={190} y2={560} stroke={W} strokeWidth={1.2} />
        <text x={90} y={548} textAnchor="middle" fill={TXT} fontSize={8}
          fontFamily="'Inter',sans-serif" style={{ pointerEvents: 'none', userSelect: 'none' }}>0</text>
        <text x={140} y={548} textAnchor="middle" fill={TXT} fontSize={8}
          fontFamily="'Inter',sans-serif" style={{ pointerEvents: 'none', userSelect: 'none' }}>10m</text>
        <text x={190} y={548} textAnchor="middle" fill={TXT} fontSize={8}
          fontFamily="'Inter',sans-serif" style={{ pointerEvents: 'none', userSelect: 'none' }}>20m</text>
      </g>

      {/* Level label */}
      <text x={940} y={556} textAnchor="end" fill={TXT} fontSize={10}
        fontFamily="'Inter',sans-serif"
        style={{ pointerEvents: 'none', userSelect: 'none' }} opacity={0.45}
        letterSpacing="2">SGC – LEVEL 28</text>
    </svg>
  )
}
