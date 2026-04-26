/**
 * AnimatedStargate — accurate Milky Way Stargate SVG.
 *
 * Geometry (SVG units, 400×400 viewBox, center = 200,200):
 *   R_OUTER    = 192   outer decorative edge
 *   R_RING_IN  = 162   inner edge of outer ring (chevron body base)
 *   CHEV_TIP   = 147   chevron beak tip (extends inward over track)
 *   R_TRACK_O  = 158   outer edge of spinning glyph track
 *   R_TRACK_I  = 118   inner edge of spinning glyph track
 *   R_GATE     = 114   event-horizon aperture
 *
 * 9 chevrons at 40° spacing, chevron 0 at top (-90°).
 * 39 glyph PNG images on the spinning inner track.
 * Render order: aperture → horizon → spinning track → outer ring donut → chevrons
 *   (chevron beaks overlap the outer edge of the track)
 */

const CX = 200
const CY = 200
const R_OUTER   = 192
const R_RING_IN = 162
const CHEV_TIP  = 147
const R_TRACK_O = 158
const R_TRACK_I = 118
const R_GATE    = 114
const R_TRACK_MID = (R_TRACK_O + R_TRACK_I) / 2  // 138

const CHEVRON_ANGLES = Array.from({ length: 9 }, (_, i) => -90 + i * 40)

/** Polar → Cartesian, returns [x, y] */
function pt(r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}

/**
 * Chevron: a trapezoidal outer body (with arc top) plus inward beak.
 *
 * Shape (viewed from outside):
 *   outer arc (R_OUTER-1) spans ±9°
 *   body sides connect to inner corners at (R_RING_IN+1, ±7°)
 *   beak narrows to tip at (CHEV_TIP, 0°)
 *
 * SVG arc note: going from angle a+9 → a-9 (decreasing angle) is
 * counterclockwise in SVG (sweep=0), which traces the short outer arc. ✓
 */
function Chevron({ angleDeg, locked }) {
    const a = angleDeg
    const rO  = R_OUTER - 1
    const rI  = R_RING_IN + 1

    const [o1x, o1y] = pt(rO, a - 9)   // outer body left
    const [o2x, o2y] = pt(rO, a + 9)   // outer body right
    const [i1x, i1y] = pt(rI, a - 7)   // inner body left
    const [i2x, i2y] = pt(rI, a + 7)   // inner body right
    const [tx,  ty ] = pt(CHEV_TIP, a) // beak tip

    // Path: tip → beak-right → body-right → outer-arc → body-left → close
    const d = [
        `M ${tx}  ${ty}`,
        `L ${i2x} ${i2y}`,
        `L ${o2x} ${o2y}`,
        `A ${rO} ${rO} 0 0 0 ${o1x} ${o1y}`,   // outer arc, CCW
        `L ${i1x} ${i1y}`,
        'Z',
    ].join(' ')

    // Center groove line from body mid to tip
    const [gmx, gmy] = pt((rO + rI) / 2, a)
    const color = locked ? '#e85500' : '#b87828'
    const glowF = locked
        ? 'drop-shadow(0 0 6px #ff6a00) drop-shadow(0 0 14px rgba(255,100,0,0.45))'
        : 'drop-shadow(0 0 3px rgba(184,120,40,0.6))'

    return (
        <g style={{ filter: glowF }}>
            <path d={d} fill={color} opacity={locked ? 1 : 0.82} />
            {/* Highlight strip along the top third */}
            <path d={d} fill="none" stroke={locked ? 'rgba(255,160,60,0.5)' : 'rgba(220,160,70,0.25)'} strokeWidth="0.8" />
            {/* Center groove */}
            <line x1={gmx} y1={gmy} x2={tx} y2={ty}
                stroke={locked ? 'rgba(255,200,100,0.45)' : 'rgba(210,150,60,0.3)'}
                strokeWidth="1.2" />
        </g>
    )
}

/**
 * Main gate component.
 * Props:
 *   size           — px size of the SVG square (default 400)
 *   spinning       — whether the inner ring rotates (default true)
 *   active         — whether the event horizon shows (default false)
 *   lockedChevrons — array of chevron indices [0–8] that glow orange-red (default [])
 *   rpm            — rotations per minute of inner track (default 0.75)
 */
export default function AnimatedStargate({
    size = 400,
    spinning = true,
    active = false,
    lockedChevrons = [],
    rpm = 0.75,
}) {
    const periodSec = (1 / rpm) * 60

    // Outer ring donut path (even-odd fill = only the annular band is filled,
    // inner area stays transparent so the track shows through beneath it).
    const donutD = [
        `M ${CX - R_OUTER} ${CY}`,
        `a ${R_OUTER} ${R_OUTER} 0 1 0 ${2 * R_OUTER} 0`,
        `a ${R_OUTER} ${R_OUTER} 0 1 0 -${2 * R_OUTER} 0`,
        `M ${CX - R_RING_IN} ${CY}`,
        `a ${R_RING_IN} ${R_RING_IN} 0 1 0 ${2 * R_RING_IN} 0`,
        `a ${R_RING_IN} ${R_RING_IN} 0 1 0 -${2 * R_RING_IN} 0`,
    ].join(' ')

    return (
        <svg
            viewBox="0 0 400 400"
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Animated Stargate"
            style={{ display: 'block' }}
        >
            <defs>
                {/* ── Glyph filter: black-on-white PNG → cyan-on-transparent ──
                    Alpha formula: A_out = 1 - luminance_in
                    Black pixel (0,0,0) → A=1 (opaque cyan)
                    White pixel (1,1,1) → A≈0 (transparent)
                    Colors are fixed to cyan (#4FC3F7 ≈ 0.31, 0.76, 0.97)       */}
                <filter id="sgGlyphF" colorInterpolationFilters="sRGB"
                    x="0%" y="0%" width="100%" height="100%">
                    <feColorMatrix type="matrix" values={
                        '0 0 0 0 0.31 ' +
                        '0 0 0 0 0.76 ' +
                        '0 0 0 0 0.97 ' +
                        '-0.333 -0.333 -0.333 0 1'
                    } />
                </filter>

                {/* Outer ring metallic band */}
                <radialGradient id="sgRingG" cx="38%" cy="32%" r="68%">
                    <stop offset="0%"   stopColor="#3a5c7a" />
                    <stop offset="45%"  stopColor="#1e3f60" />
                    <stop offset="100%" stopColor="#0a1a2e" />
                </radialGradient>

                {/* Spinning track fill */}
                <radialGradient id="sgTrackG" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#0d1e35" />
                    <stop offset="100%" stopColor="#060f1d" />
                </radialGradient>

                {/* Event horizon */}
                <radialGradient id="sgEHG" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#e0f7fa" stopOpacity={0.95} />
                    <stop offset="35%"  stopColor="#4fc3f7" stopOpacity={0.88} />
                    <stop offset="75%"  stopColor="#0277bd" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="#01579b" stopOpacity={0.3} />
                </radialGradient>
                <filter id="sgEHBlur" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="11" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                <style>{`
                    @keyframes sg-spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes sg-pulse {
                        0%,100% { opacity: 0.84; }
                        50%     { opacity: 1; }
                    }
                    .sg-track {
                        transform-origin: ${CX}px ${CY}px;
                        animation: ${spinning ? `sg-spin ${periodSec}s linear infinite` : 'none'};
                    }
                    .sg-horizon { animation: sg-pulse 3s ease-in-out infinite; }
                `}</style>
            </defs>

            {/* ── 1. Dark aperture background ── */}
            <circle cx={CX} cy={CY} r={R_GATE} fill="#030a14" />

            {/* ── 2. Event horizon (when active) ── */}
            {active && (
                <g filter="url(#sgEHBlur)">
                    <circle className="sg-horizon" cx={CX} cy={CY} r={R_GATE - 1}
                        fill="url(#sgEHG)" />
                </g>
            )}

            {/* ── 3. Spinning inner track (rendered BEHIND the outer ring) ── */}
            <g className="sg-track">
                {/* Track annulus fill */}
                <circle cx={CX} cy={CY} r={R_TRACK_O} fill="url(#sgTrackG)" />
                <circle cx={CX} cy={CY} r={R_TRACK_I} fill="#030a14" />
                {/* Track borders */}
                <circle cx={CX} cy={CY} r={R_TRACK_O} fill="none" stroke="rgba(79,195,247,0.38)" strokeWidth="1" />
                <circle cx={CX} cy={CY} r={R_TRACK_I} fill="none" stroke="rgba(79,195,247,0.2)"  strokeWidth="0.75" />

                {/* 39 glyph PNG images, each rotated to face outward (readable from outside) */}
                {Array.from({ length: 39 }, (_, i) => {
                    const angle = (360 / 39) * i
                    const [px, py] = pt(R_TRACK_MID, angle)
                    const gs = 17   // glyph image size in SVG units
                    const n  = String(i + 1).padStart(2, '0')
                    return (
                        <image
                            key={i}
                            href={`/stargate/glyphs/glyph${n}.png`}
                            x={px - gs / 2}
                            y={py - gs / 2}
                            width={gs}
                            height={gs}
                            filter="url(#sgGlyphF)"
                            // rotate so the glyph "up" faces away from center
                            transform={`rotate(${angle + 90}, ${px}, ${py})`}
                        />
                    )
                })}

                {/* Origin marker triangle at the top of the track */}
                {(() => {
                    const [tipx, tipy] = pt(R_TRACK_O - 9, -90)
                    const [blx,  bly ] = pt(R_TRACK_I + 7, -94)
                    const [brx,  bry ] = pt(R_TRACK_I + 7, -86)
                    return (
                        <polygon points={`${tipx},${tipy} ${blx},${bly} ${brx},${bry}`}
                            fill="#4fc3f7" opacity={0.9} />
                    )
                })()}
            </g>

            {/* ── 4. Outer ring donut (even-odd, overlaps the track edge) ── */}
            <path d={donutD} fillRule="evenodd" fill="url(#sgRingG)" />
            {/* Ring edge highlights */}
            <circle cx={CX} cy={CY} r={R_OUTER}     fill="none" stroke="rgba(79,195,247,0.55)" strokeWidth="1.5" />
            <circle cx={CX} cy={CY} r={R_OUTER - 6}  fill="none" stroke="rgba(79,195,247,0.1)"  strokeWidth="0.75" />
            <circle cx={CX} cy={CY} r={R_RING_IN}    fill="none" stroke="rgba(79,195,247,0.28)" strokeWidth="1" />

            {/* Radial divider lines between chevrons */}
            {CHEVRON_ANGLES.map((a, i) => {
                const mid = a + 20
                const [x1, y1] = pt(R_RING_IN, mid)
                const [x2, y2] = pt(R_OUTER,   mid)
                return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(79,195,247,0.18)" strokeWidth="0.75" />
                )
            })}

            {/* ── 5. Chevrons (on top of everything) ── */}
            {CHEVRON_ANGLES.map((a, i) => (
                <Chevron key={i} angleDeg={a} locked={lockedChevrons.includes(i)} />
            ))}

            {/* ── 6. Center indicator (when inactive) ── */}
            {!active && (
                <>
                    <circle cx={CX} cy={CY} r={9}   fill="#050d1e"
                        stroke="rgba(79,195,247,0.4)" strokeWidth="1.5" />
                    <circle cx={CX} cy={CY} r={3.5} fill="rgba(79,195,247,0.55)" />
                </>
            )}
        </svg>
    )
}
