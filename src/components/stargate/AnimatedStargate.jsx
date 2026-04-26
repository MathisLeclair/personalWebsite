import { useState, useEffect, useRef } from 'react'
import { STARGATE_ADDRESSES } from '../../data/stargateAddresses'
import { useTranslation } from 'react-i18next'

/**
 * AnimatedStargate — accurate Milky Way Stargate SVG.
 *
 * Geometry (SVG units, 400×400 viewBox, center = 200,200):
 *   R_OUTER    = 192   outer ring edge
 *   R_RING_IN  = 162   inner ring edge
 *   R_TRACK_O  = 158   outer spinning track edge
 *   R_TRACK_I  = 118   inner spinning track edge
 *   R_GATE     = 114   aperture
 *
 * Chevron = TWO independent polygons with a gap between them:
 *   HOUSING  r=192→172, ±8.5°  — the outer rectangular cap block
 *   CLAW     r=166→147, ±5.5°  — the inner arrowhead (glows when locked)
 * The 6-unit gap (r=172→166) exposes the ring beneath.
 */

const CX = 200
const CY = 200
const R_OUTER = 192
const R_RING_IN = 162

const R_TRACK_O = 158
const R_TRACK_I = 118
const R_GATE = 114
const R_TRACK_MID = (R_TRACK_O + R_TRACK_I) / 2  // 138
const N_IRIS = 10          // number of iris blades
const IRIS_OPEN_DEG = 65   // degrees each blade rotates around its own rim pivot to open

const CHEVRON_ANGLES = Array.from({ length: 9 }, (_, i) => -90 + i * 40)

// 7-chevron address: 6 side chevrons encode in order, top (0) locks on the origin glyph.
// Bottom two chevrons (indices 4 @ 70° and 5 @ 110°) are NEVER used for 7-symbol addresses.
const DIAL_SEQUENCE = [1, 2, 3, 6, 7, 8, 0]
const SPIN_DURATION = 2300   // ms ring spins per glyph
const LOCK_DURATION = 950    // ms ring paused during chevron engagement
const FLASH_DURATION = 480    // ms top-chevron white flash
const HORIZON_HOLD = 5500   // ms event horizon open
const RESET_PAUSE = 1600   // ms dark gap before next cycle

// SVG top position = 270° (= -90°). Glyph N (1-based) sits at (360/39)*(N-1)° on the unrotated ring.
// Returns the next clockwise stop angle (always > fromAngle) that puts glyph N at the top.
function glyphStopAngle(glyphNum, fromAngle) {
    const baseAngle = (360 / 39) * (glyphNum - 1)
    let target = (270 - baseAngle + 3600) % 360
    // Always spin forward
    while (target <= fromAngle + 5) target += 360
    return target
}

/** Polar → Cartesian, returns [x, y] */
function pt(r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}

/**
 * Each iris blade pivots from a point just OUTSIDE the clip boundary (R_GATE+2 vs clip R_GATE-2).
 * The wide outer base is therefore always hidden behind the gate ring — only the diagonal
 * body crossing the aperture is visible, making blades appear to emerge from behind the ring.
 * 10 blades × 36° span each, with 180° inner offset, gives full overlapping aperture coverage.
 */
function irisBladePoints(base) {
    const step = 360 / N_IRIS
    // Outer corners outside the clip — never visible, hidden behind gate ring
    const [a0x, a0y] = pt(R_GATE + 2, base)
    const [a1x, a1y] = pt(R_GATE + 2, base + step)
    // Inner corners on the opposite side of the aperture — creates diagonal petal coverage
    const [a2x, a2y] = pt(18, base + step + 180)
    const [a3x, a3y] = pt(18, base + 180)
    return `${a0x},${a0y} ${a1x},${a1y} ${a2x},${a2y} ${a3x},${a3y}`
}

/**
 * Chevron — two independent polygon pieces matching the real prop:
 *
 *  HOUSING  (outer cap block)
 *    4-corner trapezoid: outer edge r=192 → inner edge r=172, ±8.5°
 *    Same dark slate as ring body, outlined — clearly a raised mechanical panel.
 *
 *  CLAW  (inner locking arrowhead)
 *    3-corner triangle: shoulders r=166 at ±5.5°, tip r=147 at 0°
 *    Sits below the housing with a visible 6-unit gap.
 *    This is the part that glows orange-red when a glyph locks.
 *
 * Both shapes are straight-line polygons (no arcs) — looks like flat machined plates.
 */
function Chevron({ angleDeg, locked, flashing = false }) {
    const a = angleDeg

    // ── HOUSING corners (4-point trapezoid) ──
    const [h0x, h0y] = pt(192, a - 8.5)   // outer-left
    const [h1x, h1y] = pt(192, a + 8.5)   // outer-right
    const [h2x, h2y] = pt(172, a + 8.5)   // inner-right
    const [h3x, h3y] = pt(172, a - 8.5)   // inner-left

    // ── CLAW corners (3-point arrowhead) ──
    const [c0x, c0y] = pt(166, a - 5.5)   // left shoulder
    const [c1x, c1y] = pt(166, a + 5.5)   // right shoulder
    const [c2x, c2y] = pt(147, a)          // inner tip

    const houseCol = locked ? '#4a0800' : '#1c2d40'
    const clawCol = locked ? '#e03800' : '#253d58'
    const hEdge = locked ? 'rgba(255,90,20,0.4)' : 'rgba(90,150,210,0.35)'
    const cEdge = locked ? 'rgba(255,160,40,0.7)' : 'rgba(90,150,210,0.4)'
    const glowF = flashing
        ? 'drop-shadow(0 0 22px white) drop-shadow(0 0 40px rgba(255,180,50,0.95))'
        : locked
            ? 'drop-shadow(0 0 8px rgba(255,70,0,0.95)) drop-shadow(0 0 22px rgba(255,30,0,0.4))'
            : 'none'
    const glowTransition = locked && !flashing ? 'filter 0.5s ease-out' : 'none'

    return (
        <g style={{ filter: glowF, transition: glowTransition }}>
            {/* Outer housing block */}
            <polygon
                points={`${h0x},${h0y} ${h1x},${h1y} ${h2x},${h2y} ${h3x},${h3y}`}
                fill={houseCol}
                stroke={hEdge}
                strokeWidth="1"
            />
            {/* Inner locking claw */}
            <polygon
                points={`${c0x},${c0y} ${c1x},${c1y} ${c2x},${c2y}`}
                fill={clawCol}
                stroke={cEdge}
                strokeWidth="1"
            />
            {/* Locked indicator gem at claw tip */}
            {locked && (
                <circle cx={c2x} cy={c2y} r={2.8} fill="#ffcc44" opacity={0.95} />
            )}
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
    dialing = false,
    irisClosed = false,
    forcedAddress = null,   // address object to dial immediately
    dialKey = 0,            // increment to restart/interrupt current cycle
    onAddressChange = null, // callback(name) when a new address starts being dialed
}) {
    const { t } = useTranslation()
    // ── Dialing sequence state ──
    const [lockedChevs, setLockedChevs] = useState([])
    const [flashTop, setFlashTop] = useState(false)
    const [horizonOpen, setHorizonOpen] = useState(false)
    const [trackAngle, setTrackAngle] = useState(0)
    const [trackDur, setTrackDur] = useState(0)
    const [addrName, setAddrName] = useState('')
    const [statusText, setStatusText] = useState('')
    const [kawoosh, setKawoosh] = useState(false)
    const angleRef = useRef(0)
    const cancelRef = useRef(false)
    const mainTimerRef = useRef(null)
    const flashTimerRef = useRef(null)
    // capture latest props in refs so the async loop always sees current values
    const forcedAddrRef = useRef(forcedAddress)
    const onAddrChangeRef = useRef(onAddressChange)
    useEffect(() => { forcedAddrRef.current = forcedAddress }, [forcedAddress])
    useEffect(() => { onAddrChangeRef.current = onAddressChange }, [onAddressChange])

    useEffect(() => {
        if (!dialing) return
        cancelRef.current = false

        function sleep(ms) {
            return new Promise(resolve => { mainTimerRef.current = setTimeout(resolve, ms) })
        }

        async function runCycle() {
            if (cancelRef.current) return

            // Use forced address if one was requested, then fall back to random
            const addr = forcedAddrRef.current
                ?? STARGATE_ADDRESSES[Math.floor(Math.random() * STARGATE_ADDRESSES.length)]
            forcedAddrRef.current = null   // consume it — next cycle is random again
            const dialGlyphs = [...addr.glyphs, 1]

            setAddrName(addr.name)
            setStatusText('')
            setLockedChevs([])
            setFlashTop(false)
            setHorizonOpen(false)
            onAddrChangeRef.current?.(addr.name)

            for (let step = 0; step < DIAL_SEQUENCE.length; step++) {
                if (cancelRef.current) return

                // ── Spin ──
                setStatusText('')
                const target = glyphStopAngle(dialGlyphs[step], angleRef.current)
                angleRef.current = target
                setTrackDur(SPIN_DURATION)
                setTrackAngle(target)
                await sleep(SPIN_DURATION + 80)
                if (cancelRef.current) return

                // ── Lock ──
                setTrackDur(0)
                setFlashTop(true)
                const chevronWords = [
                    t('stargate.gate.words.one', 'ONE'),
                    t('stargate.gate.words.two', 'TWO'),
                    t('stargate.gate.words.three', 'THREE'),
                    t('stargate.gate.words.four', 'FOUR'),
                    t('stargate.gate.words.five', 'FIVE'),
                    t('stargate.gate.words.six', 'SIX'),
                    t('stargate.gate.words.seven', 'SEVEN'),
                ]
                const word = chevronWords[step]
                setStatusText(
                    step === DIAL_SEQUENCE.length - 1
                        ? t('stargate.gate.chevronSevenLocked', 'CHEVRON SEVEN... LOCKED')
                        : t('stargate.gate.chevronEncoded', {
                            defaultValue: 'CHEVRON {{word}} ENCODED',
                            word,
                        })
                )
                clearTimeout(flashTimerRef.current)
                flashTimerRef.current = setTimeout(
                    () => { if (!cancelRef.current) setFlashTop(false) },
                    FLASH_DURATION
                )
                setLockedChevs(prev => [...prev, DIAL_SEQUENCE[step]])
                await sleep(LOCK_DURATION)
                if (cancelRef.current) return
            }

            // ── Event horizon + kawoosh ──
            setStatusText(t('stargate.gate.wormholeEstablished', 'WORMHOLE ESTABLISHED'))
            setHorizonOpen(true)      // horizon and burst start together
            setKawoosh(true)
            await sleep(900)          // kawoosh animation duration
            setKawoosh(false)
            await sleep(HORIZON_HOLD - 900)  // rest of horizon hold
            if (cancelRef.current) return

            // ── Reset ──
            setHorizonOpen(false)
            setKawoosh(false)
            setLockedChevs([])
            setFlashTop(false)
            setAddrName('')
            setStatusText('')
            onAddrChangeRef.current?.('')
            setTrackDur(0)
            const normalized = angleRef.current % 360
            angleRef.current = normalized
            setTrackAngle(normalized)
            await sleep(RESET_PAUSE)
            if (cancelRef.current) return

            runCycle()
        }

        const delay = forcedAddrRef.current ? 0 : 800
        sleep(delay).then(() => { if (!cancelRef.current) runCycle() })

        return () => {
            cancelRef.current = true
            clearTimeout(mainTimerRef.current)
            clearTimeout(flashTimerRef.current)
        }
    }, [dialing, dialKey, t])  // dialKey restarts cycle when user selects an address

    // ── Computed render values ──
    const lockedSet = dialing ? lockedChevs : lockedChevrons
    const showHorizon = dialing ? horizonOpen : active
    const periodSec = (1 / rpm) * 60

    // Dialing mode: JS-driven transform + CSS transition for the spin.
    // Passive mode: pure CSS infinite animation.
    const innerTrackStyle = dialing
        ? {
            transformOrigin: `${CX}px ${CY}px`,
            transform: `rotate(${trackAngle}deg)`,
            transition: trackDur > 0 ? `transform ${trackDur}ms linear` : 'none',
        }
        : {
            transformOrigin: `${CX}px ${CY}px`,
            animation: spinning ? `sg-spin ${periodSec}s linear infinite` : 'none',
        }

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

    // Extend viewBox: extra height for status + address label when dialing
    const viewH = dialing ? 452 : 400
    const svgH = dialing ? size * (452 / 400) : size

    return (
        <svg
            viewBox={`0 0 400 ${viewH}`}
            width={size}
            height={svgH}
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
                    <stop offset="0%" stopColor="#2a3a4a" />
                    <stop offset="50%" stopColor="#192535" />
                    <stop offset="100%" stopColor="#0c151f" />
                </radialGradient>

                {/* Spinning track fill */}
                <radialGradient id="sgTrackG" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0d1e35" />
                    <stop offset="100%" stopColor="#060f1d" />
                </radialGradient>

                {/* Event horizon steady gradient */}
                <radialGradient id="sgEHG" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e0f7fa" stopOpacity={0.95} />
                    <stop offset="35%" stopColor="#4fc3f7" stopOpacity={0.88} />
                    <stop offset="75%" stopColor="#0277bd" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="#01579b" stopOpacity={0.3} />
                </radialGradient>
                <filter id="sgEHBlur" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="11" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                {/* Kawoosh burst gradient */}
                <radialGradient id="sgKawooshG" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity={1} />
                    <stop offset="25%" stopColor="#e0f7fa" stopOpacity={0.95} />
                    <stop offset="60%" stopColor="#4fc3f7" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#0277bd" stopOpacity={0} />
                </radialGradient>

                <style>{`
                    @keyframes sg-spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes sg-pulse {
                        0%,100% { opacity: 0.84; }
                        50%     { opacity: 1; }
                    }
                    .sg-horizon { animation: sg-pulse 3s ease-in-out infinite; }

                    /* Kawoosh fill disk — expands out past the ring then fades */
                    @keyframes sg-kawoosh-fill {
                        0%   { transform: scale(0.01); opacity: 0; }
                        6%   { opacity: 1; }
                        42%  { transform: scale(2.05); opacity: 0.88; }
                        70%  { transform: scale(1.85); opacity: 0.35; }
                        100% { transform: scale(1.65); opacity: 0; }
                    }
                    /* Shockwave ring — thin circle shoots outward */
                    @keyframes sg-kawoosh-wave {
                        0%   { transform: scale(0.04); opacity: 0.9; }
                        100% { transform: scale(3.2);  opacity: 0; }
                    }
                    /* Secondary ripple — slightly delayed inner ring */
                    @keyframes sg-kawoosh-ripple {
                        0%   { transform: scale(0.08); opacity: 0.65; }
                        100% { transform: scale(2.4);  opacity: 0; }
                    }
                `}</style>

                <clipPath id="sgIrisClip">
                    <circle cx={CX} cy={CY} r={R_GATE - 2} />
                </clipPath>
            </defs>

            {/* ── 1. Dark aperture background ── */}
            <circle cx={CX} cy={CY} r={R_GATE} fill="#030a14" />

            {/* ── 3. Spinning inner track (rendered BEHIND the outer ring) ── */}
            <g style={innerTrackStyle}>
                {/* Track annulus fill */}
                <circle cx={CX} cy={CY} r={R_TRACK_O} fill="url(#sgTrackG)" />
                <circle cx={CX} cy={CY} r={R_TRACK_I} fill="#030a14" />
                {/* Track borders */}
                <circle cx={CX} cy={CY} r={R_TRACK_O} fill="none" stroke="rgba(79,195,247,0.38)" strokeWidth="1" />
                <circle cx={CX} cy={CY} r={R_TRACK_I} fill="none" stroke="rgba(79,195,247,0.2)" strokeWidth="0.75" />

                {/* 39 glyph PNG images, each rotated to face outward (readable from outside) */}
                {Array.from({ length: 39 }, (_, i) => {
                    const angle = (360 / 39) * i
                    const [px, py] = pt(R_TRACK_MID, angle)
                    const gs = 17   // glyph image size in SVG units
                    const n = String(i + 1).padStart(2, '0')
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

            </g>

            {/* ── 2. Event horizon (above track so it isn't covered) ── */}
            {showHorizon && (
                <g filter="url(#sgEHBlur)">
                    <circle className="sg-horizon" cx={CX} cy={CY} r={R_GATE - 1}
                        fill="url(#sgEHG)" />
                </g>
            )}

            {/* ── 2b. Kawoosh burst (above horizon, below ring+chevrons) ── */}
            {kawoosh && (
                <>
                    {/* Fill disk: bright radial burst expanding past the ring */}
                    <circle
                        cx={CX} cy={CY} r={R_GATE - 1}
                        fill="url(#sgKawooshG)"
                        style={{
                            transformBox: 'fill-box',
                            transformOrigin: 'center',
                            animation: 'sg-kawoosh-fill 900ms ease-out forwards',
                        }}
                    />
                    {/* Outer shockwave ring — shoots far past the gate */}
                    <circle
                        cx={CX} cy={CY} r={R_GATE - 1}
                        fill="none"
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth="5"
                        style={{
                            transformBox: 'fill-box',
                            transformOrigin: 'center',
                            animation: 'sg-kawoosh-wave 580ms ease-out forwards',
                        }}
                    />
                    {/* Inner ripple ring — softer, slower secondary wave */}
                    <circle
                        cx={CX} cy={CY} r={R_GATE - 1}
                        fill="none"
                        stroke="rgba(79,195,247,0.75)"
                        strokeWidth="8"
                        style={{
                            transformBox: 'fill-box',
                            transformOrigin: 'center',
                            animation: 'sg-kawoosh-ripple 750ms ease-out forwards',
                            animationDelay: '60ms',
                        }}
                    />
                </>
            )}

            {/* ── Iris diaphragm ──
                 Pivot is at R_GATE+2, just outside the clip boundary at R_GATE-2.
                 The wide blade base is clipped and hidden behind the gate ring.
                 Only the diagonal body crossing the aperture is visible. */}
            <g style={{ pointerEvents: 'none' }} clipPath="url(#sgIrisClip)">
                {Array.from({ length: N_IRIS }, (_, i) => {
                    const base = i * (360 / N_IRIS)
                    const [px, py] = pt(R_GATE + 2, base)
                    return (
                        <polygon
                            key={`iris-blade-${i}`}
                            points={irisBladePoints(base)}
                            fill="rgba(88,108,124,0.97)"
                            stroke="rgba(200,218,232,0.45)"
                            strokeWidth="0.75"
                            style={{
                                transformOrigin: `${px}px ${py}px`,
                                transform: `rotate(${irisClosed ? 0 : IRIS_OPEN_DEG}deg)`,
                                opacity: irisClosed ? 1 : 0,
                                transitionProperty: 'transform, opacity',
                                transitionDuration: '700ms, 480ms',
                                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1), ease-in',
                                transitionDelay: '0ms, 0ms',
                            }}
                        />
                    )
                })}
            </g>

            {/* ── 4. Outer ring donut (even-odd, overlaps the track edge) ── */}
            <path d={donutD} fillRule="evenodd" fill="url(#sgRingG)" />
            {/* Ring edge highlights */}
            <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(100,160,220,0.45)" strokeWidth="1.5" />
            <circle cx={CX} cy={CY} r={R_OUTER - 6} fill="none" stroke="rgba(80,120,180,0.1)" strokeWidth="0.75" />
            <circle cx={CX} cy={CY} r={R_RING_IN} fill="none" stroke="rgba(100,160,220,0.3)" strokeWidth="1" />

            {/* Segment dividers: two radial lines flanking each chevron position,
                matching the rectangular panel borders visible on the real gate ring. */}
            {CHEVRON_ANGLES.map((a, i) => {
                // Lines at ±10° from chevron center (just outside the ±8.5° chevron cap)
                return [-10, 10].map(offset => {
                    const ang = a + offset
                    const [x1, y1] = pt(R_RING_IN, ang)
                    const [x2, y2] = pt(R_OUTER, ang)
                    return (
                        <line key={`${i}-${offset}`} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="rgba(60,100,150,0.35)" strokeWidth="1" />
                    )
                })
            })}

            {/* ── 5. Chevrons (on top of everything) ── */}
            {CHEVRON_ANGLES.map((a, i) => (
                <Chevron key={i} angleDeg={a} locked={lockedSet.includes(i)} flashing={i === 0 && flashTop} />
            ))}



            {/* ── 7. Destination label (dialing mode only) ── */}
            {dialing && (
                <>
                    <line x1="50" y1="408" x2="350" y2="408"
                        stroke="rgba(79,195,247,0.15)" strokeWidth="0.75" />
                    {/* Status: CHEVRON N ENCODED / WORMHOLE ESTABLISHED */}
                    <text
                        x={CX} y={422}
                        textAnchor="middle"
                        fill={statusText ? 'rgba(255,200,80,0.82)' : 'transparent'}
                        fontFamily="'Courier New', monospace"
                        fontSize="9"
                        letterSpacing="2"
                    >
                        {statusText || ' '}
                    </text>
                    {/* Address name */}
                    <text
                        x={CX} y={440}
                        textAnchor="middle"
                        fill={addrName ? 'rgba(79,195,247,0.82)' : 'transparent'}
                        fontFamily="'Courier New', monospace"
                        fontSize="11"
                        letterSpacing="2.5"
                    >
                        {addrName || ' '}
                    </text>
                </>
            )}
        </svg>
    )
}
