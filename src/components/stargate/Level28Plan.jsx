// Level 28 – SGC Gate Level
// Approach: single <svg> with viewBox cropping in SVG space — all zone coords are raw image pixels.
// Image natural size: 1119×960 (sgc-plan.png)
// Level 28 outer wall in image pixels: x=30..820, y=193..920
// viewBox: "25 188 800 737" → shows x=25..825, y=188..925 (5px margin on all sides)
//
// Set DEBUG=true to see coloured zones for calibration.
const DEBUG = false

const TXT = '#b3e5fc'
const FILL_D = DEBUG ? 'rgba(79,195,247,0.25)' : 'transparent'
const FILL_H = 'rgba(79,195,247,0.20)'
const FILL_S = 'rgba(79,195,247,0.38)'
const FILL_A = 'rgba(79,195,247,0.50)'

// turns black-on-white blueprint → cyan-on-dark
const FILTER = 'invert(1) sepia(1) saturate(4) hue-rotate(182deg) brightness(0.68)'

function Lbl({ x, y, lines, size = 18 }) {
    return lines.map((l, i) => (
        <text key={i} x={x} y={y + i * 22}
            textAnchor="middle" fill={TXT} fontSize={size}
            fontFamily="'Inter',sans-serif"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
            opacity={DEBUG ? 1 : 0.82}>{l}</text>
    ))
}

export default function Level28Plan({ selectedRoom, onRoomSelect }) {
    const clk = id => () => onRoomSelect(id)
    const cls = id => `l28r${selectedRoom === id ? ' sel' : ''}`
    const f = () => FILL_D   // static debug fill, hover/sel handled by CSS

    return (
        <svg
            viewBox="25 188 800 737"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block', background: '#050d1a' }}
            aria-label="SGC Level 28 Floor Plan"
        >
            <defs>
                <style>{`
          .l28r { cursor: pointer; }
          .l28r .f { fill: ${FILL_D}; transition: fill 0.18s ease; }
          .l28r:hover .f { fill: ${FILL_H}; }
          .l28r.sel .f { fill: ${FILL_S}; }
          .l28r.sel:hover .f { fill: ${FILL_A}; }
        `}</style>
            </defs>

            {/* ── Blueprint image, full natural size; viewBox does the cropping ── */}
            <image
                href="/stargate/sgc-plan.png"
                x="0" y="0" width="1119" height="960"
                preserveAspectRatio="none"
                style={{ filter: FILTER }}
            />

            {/* ════ INTERACTIVE ZONES (image pixel coords) ════ */}

            {/* ── Gate room ── */}
            <g id="room-l28-gateroom" className={cls('l28-gateroom')} onClick={clk('l28-gateroom')}>
                <polygon className="f" points="114,266 504,266 547,315 549,421 514,462 513,488 111,485 115,267" />
                <Lbl x={311} y={366} lines={['Gate', 'Room']} />
            </g>

            {/* ── Control room ── */}
            <g id="room-l28-control-room" className={cls('l28-control-room')} onClick={clk('l28-control-room')}>
                <polygon className="f" points="512,264 520,236 717,235 714,312 753,324 751,429 711,439 714,481 697,480 697,496 517,493 518,459 553,421 550,312 551,312" />
                <Lbl x={632} y={364} lines={['Control', 'Room']} />
            </g>

            {/* ── Laboratory ── */}
            <g id="room-l28-laboratory" className={cls('l28-laboratory')} onClick={clk('l28-laboratory')}>
                <polygon className="f" points="112,756 285,757 291,920 109,921" />
                <Lbl x={199} y={839} lines={['Laboratory']} size={14} />
            </g>

            {/* ── Observation deck ── */}
            <g id="room-l28-observation-deck" className={cls('l28-observation-deck')} onClick={clk('l28-observation-deck')}>
                <rect className="f" x={42} y={780} width={70} height={118} />
                <Lbl x={77} y={839} lines={['Obs.']} size={11} />
            </g>

            {/* ── Staging room ── */}
            <g id="room-l28-staging-room" className={cls('l28-staging-room')} onClick={clk('l28-staging-room')}>
                <rect className="f" x={316} y={485} width={192} height={129} />
                <Lbl x={412} y={543} lines={['Staging', 'Room']} size={13} />
            </g>

            {/* ── Toilets ── */}
            <g id="room-l28-toilets" className={cls('l28-toilets')} onClick={clk('l28-toilets')}>
                <polygon className="f" points="754,435 714,435 714,481 699,480 697,540 715,540 717,636 756,638" />
                <Lbl x={721} y={523} lines={['WC']} size={11} />
            </g>

            {/* ── Round hallway ── */}
            <g id="room-l28-round-hallway" className={cls('l28-round-hallway')} onClick={clk('l28-round-hallway')}>
                <polygon className="f" points="628,496 631,639 618,653 464,651 463,617 379,618 379,812 463,814 466,740 538,739 619,739 635,753 709,754 736,737 745,712 743,677 739,653 714,635 710,545 696,544 695,497" />
                <Lbl x={608} y={657} lines={['Round', 'Hallway']} size={13} />
            </g>

            {/* ── Elevator — surface (left shaft, x=538) ── */}
            <g id="room-l28-elevator-surface" className={cls('l28-elevator-surface')} onClick={clk('l28-elevator-surface')}>
                <rect className="f" x={538} y={740} width={56} height={76} />
                <Lbl x={566} y={778} lines={['Elev.', 'Surface']} size={9} />
            </g>

            {/* ── Elevator — Level 27 (right shaft, x=650) ── */}
            <g id="room-l28-elevator-l27" className={cls('l28-elevator-l27')} onClick={clk('l28-elevator-l27')}>
                <rect className="f" x={650} y={755} width={52} height={76} />
                <Lbl x={676} y={793} lines={['Elev.', 'L27']} size={9} />
            </g>

            {/* ── Outer corridor (multi-shape) ── */}
            <g id="room-l28-outer-corridor" className={cls('l28-outer-corridor')} onClick={clk('l28-outer-corridor')}>
                <rect className="f" x={45} y={199} width={64} height={385} />
                <rect className="f" x={109} y={197} width={398} height={67} />
                <rect className="f" x={506} y={197} width={300} height={39} />
                <rect className="f" x={717} y={235} width={89} height={76} />
                <rect className="f" x={756} y={311} width={52} height={490} />
                <rect className="f" x={704} y={755} width={49} height={48} />
                <rect className="f" x={706} y={797} width={42} height={83} />
                <rect className="f" x={634} y={829} width={113} height={52} />
                <Lbl x={280} y={227} lines={['Outer Corridor']} size={13} />
            </g>

            <text x={820} y={922} textAnchor="end" fill={TXT} fontSize={11}
                fontFamily="'Inter',sans-serif"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                opacity={0.28} letterSpacing="2">SGC – LEVEL 28</text>
        </svg>
    )
}
