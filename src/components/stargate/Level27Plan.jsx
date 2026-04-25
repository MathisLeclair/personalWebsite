// Level 27 – SGC Administrative Level
// Approach: single <svg> with viewBox cropping in SVG space — all zone coords are raw image pixels.
// Image natural size: 1119×960 (sgc-plan.png)
// Level 27 outer wall in image pixels: x=843..1097, y=193..920
// viewBox: "838 188 264 737" → shows x=838..1102, y=188..925 (5px margin)
//
// Set DEBUG=true to see coloured zones for calibration.
const DEBUG = false

const TXT    = '#b3e5fc'
const FILL_D = DEBUG ? 'rgba(79,195,247,0.25)' : 'transparent'
const FILL_H = 'rgba(79,195,247,0.20)'
const FILL_S = 'rgba(79,195,247,0.38)'
const FILL_A = 'rgba(79,195,247,0.50)'
const FILTER = 'invert(1) sepia(1) saturate(4) hue-rotate(182deg) brightness(0.68)'

function Lbl({ x, y, lines, size = 14 }) {
  return lines.map((l, i) => (
    <text key={i} x={x} y={y + i * 18}
      textAnchor="middle" fill={TXT} fontSize={size}
      fontFamily="'Inter',sans-serif"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
      opacity={DEBUG ? 1 : 0.82}>{l}</text>
  ))
}

export default function Level27Plan({ selectedRoom, onRoomSelect }) {
  const clk = id => () => onRoomSelect(id)
  const cls = id => `l27r${selectedRoom === id ? ' sel' : ''}`

  return (
    <svg
      viewBox="838 188 264 737"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '72vh', width: 'auto', maxWidth: '100%', display: 'block', margin: '0 auto', background: '#050d1a' }}
      aria-label="SGC Level 27 Floor Plan"
    >
      <defs>
        <style>{`
          .l27r { cursor: pointer; }
          .l27r .f { fill: ${FILL_D}; transition: fill 0.18s ease; }
          .l27r:hover .f { fill: ${FILL_H}; }
          .l27r.sel .f { fill: ${FILL_S}; }
          .l27r.sel:hover .f { fill: ${FILL_A}; }
        `}</style>
      </defs>

      {/* Blueprint image – full natural size; viewBox crops to Level 27 */}
      <image
        href="/stargate/sgc-plan.png"
        x="0" y="0" width="1119" height="960"
        preserveAspectRatio="none"
        style={{ filter: FILTER }}
      />

      {/* ════ INTERACTIVE ZONES (image pixel coords) ════ */}

      {/* ── Briefing room ── */}
      <g id="room-l27-briefing-room" className={cls('l27-briefing-room')} onClick={clk('l27-briefing-room')}>
        <polygon className="f" points="868,291 866,460 877,460 878,489 1049,490 1048,431 1063,431 1083,411 1083,339 1063,318 1049,319 1049,251 911,248 887,256" />
        <Lbl x={967} y={362} lines={['Briefing', 'Room']} />
      </g>

      {/* ── General's office ── */}
      <g id="room-l27-generals-office" className={cls('l27-generals-office')} onClick={clk('l27-generals-office')}>
        <polygon className="f" points="991,492 878,490 879,596 993,599" />
        <Lbl x={935} y={537} lines={["General's", 'Office']} size={12} />
      </g>

      {/* ── Elevator ── */}
      <g id="room-l27-elevator" className={cls('l27-elevator')} onClick={clk('l27-elevator')}>
        <rect className="f" x={887} y={711} width={45} height={58} />
        <Lbl x={909} y={742} lines={['Elev.']} size={10} />
      </g>

      <text x={1097} y={922} textAnchor="end" fill={TXT} fontSize={10}
        fontFamily="'Inter',sans-serif"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        opacity={0.28} letterSpacing="2">SGC – LEVEL 27</text>
    </svg>
  )
}
