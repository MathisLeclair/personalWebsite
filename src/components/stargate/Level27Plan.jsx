/**
 * Level 27 Floor Plan – SGC Cheyenne Mountain
 *
 * Design: rooms share walls, single outer perimeter, architectural door symbols,
 * room furniture details. viewBox 0 0 960 400.
 *
 * Column boundaries (x):  left=30  stairR=165  briefR=510  genR=710  secR=840  right=920
 * Row boundaries (y):     top=30   corridorT=230  corridorB=310  bottom=370
 */

const W = '#4fc3f7'
const FILL_D = 'rgba(79,195,247,0.08)'
const FILL_H = 'rgba(79,195,247,0.22)'
const FILL_S = 'rgba(79,195,247,0.36)'
const TXT = '#b3e5fc'
const BG = '#050d1a'
const WALL_O = '#5ecfff'
const WALL_I = '#4fc3f7'

function Lbl({ x, y, lines }) {
  return lines.map((l, i) => (
    <text key={i} x={x} y={y + i * 13} textAnchor="middle" fill={TXT} fontSize={10}
      fontFamily="'Inter',sans-serif" style={{ pointerEvents: 'none', userSelect: 'none' }} opacity={0.9}>{l}</text>
  ))
}

function Wall({ x1, y1, x2, y2, t = 4 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={WALL_I} strokeWidth={t} strokeLinecap="square" />
}

export default function Level27Plan({ selectedRoom, onRoomSelect }) {
  const sel = id => selectedRoom === id
  const fill = id => sel(id) ? FILL_S : FILL_D

  // Boundaries
  const lft = 30, stR = 165, brR = 510, gnR = 710, scR = 840, rgt = 920
  const top = 30, corT = 230, corB = 310, bot = 370

  return (
    <svg viewBox="0 0 960 400" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="SGC Level 27 Floor Plan">
      <defs>
        <filter id="l27glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="l27dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.55" fill={W} opacity="0.18" />
        </pattern>
        <style>{`
          .l27r { cursor:pointer; }
          .l27r .f { transition: fill 0.18s ease; }
          .l27r:hover .f { fill: ${FILL_H}; }
        `}</style>
      </defs>

      <rect width="960" height="400" fill={BG} />
      <rect width="960" height="400" fill="url(#l27dots)" />

      {/* ── ROOM FILLS ── */}

      {/* Spiral Staircase */}
      <g id="room-l27-spiral-stair" className="l27r" onClick={() => onRoomSelect('l27-spiral-stair')}>
        <rect className="f" x={lft} y={top} width={stR-lft} height={corT-top} fill={fill('l27-spiral-stair')} />
        <circle cx={97} cy={130} r={50} fill="none" stroke={W} strokeWidth={0.8} opacity={0.3} />
        <circle cx={97} cy={130} r={33} fill="none" stroke={W} strokeWidth={0.8} opacity={0.3} />
        <circle cx={97} cy={130} r={16} fill="none" stroke={W} strokeWidth={0.8} opacity={0.3} />
        <line x1={97} y1={80} x2={97} y2={180} stroke={W} strokeWidth={0.7} opacity={0.25} />
        <line x1={47} y1={130} x2={147} y2={130} stroke={W} strokeWidth={0.7} opacity={0.25} />
        <Lbl x={97} y={125} lines={['Spiral','Stair']} />
      </g>

      {/* Briefing Room */}
      <g id="room-briefing" className="l27r" onClick={() => onRoomSelect('l27-briefing')}>
        <rect className="f" x={stR} y={top} width={brR-stR} height={corT-top} fill={fill('l27-briefing')} />
        <ellipse cx={337} cy={128} rx={90} ry={34} fill="none" stroke={W} strokeWidth={0.9} opacity={0.32} />
        {[-60,-30,0,30,60].map(dx=>(
          <rect key={dx} x={337+dx-7} y={86} width={14} height={9} rx={2} fill="none" stroke={W} strokeWidth={0.6} opacity={0.25} />
        ))}
        {[-60,-30,0,30,60].map(dx=>(
          <rect key={dx} x={337+dx-7} y={162} width={14} height={9} rx={2} fill="none" stroke={W} strokeWidth={0.6} opacity={0.25} />
        ))}
        <Lbl x={337} y={122} lines={['Briefing Room']} />
      </g>

      {/* General Office */}
      <g id="room-generals-office" className="l27r" onClick={() => onRoomSelect('l27-generals-office')}>
        <rect className="f" x={brR} y={top} width={gnR-brR} height={corT-top} fill={fill('l27-generals-office')} />
        <rect x={540} y={60} width={110} height={18} fill="none" stroke={W} strokeWidth={0.9} opacity={0.32} />
        <rect x={630} y={60} width={18} height={60} fill="none" stroke={W} strokeWidth={0.9} opacity={0.32} />
        <circle cx={580} cy={96} r={11} fill="none" stroke={W} strokeWidth={0.7} opacity={0.25} />
        <Lbl x={610} y={128} lines={["General's",'Office']} />
      </g>

      {/* Security Station */}
      <g id="room-l27-security" className="l27r" onClick={() => onRoomSelect('l27-security')}>
        <rect className="f" x={gnR} y={top} width={scR-gnR} height={corT-top} fill={fill('l27-security')} />
        <rect x={728} y={80} width={82} height={28} rx={2} fill="none" stroke={W} strokeWidth={0.9} opacity={0.32} />
        <Lbl x={775} y={128} lines={['Security','Station']} />
      </g>

      {/* Elevator */}
      <g id="room-l27-elevator" className="l27r" onClick={() => onRoomSelect('l27-elevator')}>
        <rect className="f" x={scR} y={top} width={rgt-scR} height={corT-top} fill={fill('l27-elevator')} />
        <rect x={852} y={55} width={58} height={148} rx={3} fill="none" stroke={W} strokeWidth={0.8} opacity={0.32} />
        <line x1={852} y1={55} x2={910} y2={203} stroke={W} strokeWidth={0.7} opacity={0.2} />
        <line x1={910} y1={55} x2={852} y2={203} stroke={W} strokeWidth={0.7} opacity={0.2} />
        <polygon points="876,44 880,36 884,44" fill={W} opacity={0.45} />
        <polygon points="876,214 880,222 884,214" fill={W} opacity={0.45} />
        <Lbl x={880} y={135} lines={['Elev.']} />
      </g>

      {/* Corridor */}
      <g id="room-l27-corridor" className="l27r" onClick={() => onRoomSelect('l27-corridor')}>
        <rect className="f" x={lft} y={corT} width={rgt-lft} height={corB-corT} fill={fill('l27-corridor')} />
        <line x1={lft+10} y1={270} x2={rgt-10} y2={270} stroke={W} strokeWidth={0.8} strokeDasharray="10,8" opacity={0.18} />
        <Lbl x={480} y={274} lines={['Corridor']} />
      </g>

      {/* Lower utility strip */}
      <rect x={lft} y={corB} width={rgt-lft} height={bot-corB} fill="rgba(79,195,247,0.03)" />

      {/* ── WALLS ON TOP ── */}
      {/* Outer perimeter */}
      <rect x={lft} y={top} width={rgt-lft} height={bot-top} fill="none" stroke={WALL_O} strokeWidth={5} strokeLinejoin="miter" />

      {/* Internal vertical walls */}
      <Wall x1={stR} y1={top} x2={stR} y2={corT} />
      <Wall x1={brR} y1={top} x2={brR} y2={corT} />
      <Wall x1={gnR} y1={top} x2={gnR} y2={corT} />
      <Wall x1={scR} y1={top} x2={scR} y2={corT} />

      {/* Horizontal walls */}
      <Wall x1={lft} y1={corT} x2={rgt} y2={corT} />
      <Wall x1={lft} y1={corB} x2={rgt} y2={corB} />

      {/* ── DOORS (gap + arc) ── */}
      {/* Briefing → Corridor */}
      <line x1={270} y1={corT-1} x2={320} y2={corT+1} stroke={BG} strokeWidth={9} />
      <path d={`M270,${corT} a50,50 0 0 0 50,0`} fill="none" stroke={W} strokeWidth={0.8} opacity={0.4} strokeDasharray="3,3" />
      {/* General → Corridor */}
      <line x1={565} y1={corT-1} x2={615} y2={corT+1} stroke={BG} strokeWidth={9} />
      <path d={`M565,${corT} a50,50 0 0 0 50,0`} fill="none" stroke={W} strokeWidth={0.8} opacity={0.4} strokeDasharray="3,3" />
      {/* Security → Corridor */}
      <line x1={742} y1={corT-1} x2={784} y2={corT+1} stroke={BG} strokeWidth={9} />
      <path d={`M742,${corT} a42,42 0 0 0 42,0`} fill="none" stroke={W} strokeWidth={0.8} opacity={0.4} strokeDasharray="3,3" />
      {/* Staircase → Corridor */}
      <line x1={55} y1={corT-1} x2={110} y2={corT+1} stroke={BG} strokeWidth={9} />
      <path d={`M55,${corT} a55,55 0 0 0 55,0`} fill="none" stroke={W} strokeWidth={0.8} opacity={0.4} strokeDasharray="3,3" />
      {/* Elevator → Corridor (no door, just gap to show passage) */}
      <line x1={850} y1={corT-1} x2={910} y2={corT+1} stroke={BG} strokeWidth={9} />

      {/* ── Annotations ── */}
      <text x={46} y={392} fill={W} fontSize={11} fontFamily="'Inter',sans-serif" opacity={0.5} fontWeight="600" letterSpacing="1">LEVEL 27 — ADMINISTRATIVE</text>
      <line x1={820} y1={388} x2={900} y2={388} stroke={W} strokeWidth={1} opacity={0.38} />
      <line x1={820} y1={383} x2={820} y2={393} stroke={W} strokeWidth={1} opacity={0.38} />
      <line x1={900} y1={383} x2={900} y2={393} stroke={W} strokeWidth={1} opacity={0.38} />
      <text x={860} y={381} textAnchor="middle" fill={TXT} fontSize={8} fontFamily="'Inter',sans-serif" opacity={0.38}>~30 m</text>

      {/* CLASSIFIED watermark */}
      <text x={480} y={215} textAnchor="middle" fill={W} fontSize={52} fontFamily="'Inter',sans-serif"
        opacity={0.022} fontWeight="900" letterSpacing="12" style={{ userSelect:'none', pointerEvents:'none' }}>CLASSIFIED</text>
    </svg>
  )
}
