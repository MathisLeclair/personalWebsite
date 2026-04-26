import { useState, useRef, useCallback } from 'react'
import { Box, Tabs, Tab, Typography, Tooltip, IconButton, Drawer, Divider, Button } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import CloseIcon from '@mui/icons-material/Close'
import Level27Plan from './Level27Plan'
import Level28Plan from './Level28Plan'
import AnimatedStargate from './AnimatedStargate'
import { STARGATE_ADDRESSES } from '../../data/stargateAddresses'
import { SGC_MEMBERS } from '../../data/sgcMembers'
import { STARGATE_TIMELINE } from '../../data/stargateTimeline'
import { useTranslation } from 'react-i18next'

const ADDRESS_LORE = {
    ABYDOS: {
        key: 'abydos',
        worldType: 'Desert world / Ancient cultural nexus',
        faction: 'Abydonians, Tau\'ri allied',
        risk: 'MEDIUM',
        intel: 'First off-world destination reached by Earth in the modern Stargate era. Historical inscriptions here were key to decoding gate travel.',
        tactical: 'Population generally friendly. Maintain cultural protocols and avoid contaminating local political structures.',
    },
    CHULAK: {
        key: 'chulak',
        worldType: 'Goa\'uld-controlled feudal world',
        faction: 'Jaffa of Apophis (historical)',
        risk: 'HIGH',
        intel: 'Major operational theater tied to Apophis and early resistance contacts including Teal\'c.',
        tactical: 'Expect patrols, heavy staff-weapon presence, and rapid escalation if identity is compromised.',
    },
    TOLLAN: {
        key: 'tollan',
        worldType: 'Advanced technocratic world',
        faction: 'Tollan',
        risk: 'LOW',
        intel: 'Technologically superior but politically isolationist civilization with strict non-interference doctrine.',
        tactical: 'Diplomatic posture recommended. Technical exchange is highly restricted.',
    },
    TOLLANA: {
        key: 'tollana',
        worldType: 'Relocated Tollan colony world',
        faction: 'Tollan survivors',
        risk: 'MEDIUM',
        intel: 'Successor settlement after Tollan evacuation. Politically sensitive and vulnerable to Goa\'uld manipulation.',
        tactical: 'Intel value high. Prioritize political threat assessment over direct engagement.',
    },
    KHEB: {
        key: 'kheb',
        worldType: 'Sacred ascension site',
        faction: 'Unaffiliated spiritual enclave',
        risk: 'LOW',
        intel: 'Rarely visited world associated with Ancient knowledge and ascension-era mythology.',
        tactical: 'Minimal force posture. Scientific and cultural teams preferred.',
    },
    TARTARUS: {
        key: 'tartarus',
        worldType: 'Industrial prison and labor world',
        faction: 'Goa\'uld / Jaffa infrastructure',
        risk: 'EXTREME',
        intel: 'Critical enemy logistics and detention location linked to high-value prisoner and military movement.',
        tactical: 'Hostile environment. Covert infiltration only with extraction window pre-planned.',
    },
    'PRACLARUSH TAONAS': {
        key: 'praclarush_taonas',
        worldType: 'Ancient city-world ruin',
        faction: 'Ancient infrastructure remnants',
        risk: 'HIGH',
        intel: 'Site tied to strategic Ancient systems and long-range defense assets.',
        tactical: 'Ancient tech can be unstable. Bring technical containment and hazard response kits.',
    },
    EURONDA: {
        key: 'euronda',
        worldType: 'Militarized authoritarian state world',
        faction: 'Eurondan regime',
        risk: 'HIGH',
        intel: 'Contact scenario demonstrated severe ideological and humanitarian risk factors.',
        tactical: 'Strict engagement controls and deep political vetting mandatory.',
    },
    EDORA: {
        key: 'edora',
        worldType: 'Agrarian world with stellar anomaly exposure',
        faction: 'Edoran civilians',
        risk: 'MEDIUM',
        intel: 'Known for periodic environmental hazards linked to unusual stellar behavior.',
        tactical: 'Deploy atmospheric and radiation monitoring on arrival.',
    },
    'EARTH (Beta Gate)': {
        key: 'earth_beta_gate',
        worldType: 'Earth-linked alternate gate scenario',
        faction: 'Tau\'ri internal',
        risk: 'LOW',
        intel: 'Important historical incident for understanding dual-gate routing and inbound/outbound edge cases.',
        tactical: 'Primary value is procedural validation, not field conflict.',
    },
}

function getAddressLore(addr, t) {
    const lore = ADDRESS_LORE[addr.name]
    if (lore) {
        return {
            worldType: t(`stargate.lore.entries.${lore.key}.worldType`, lore.worldType),
            faction: t(`stargate.lore.entries.${lore.key}.faction`, lore.faction),
            risk: t(`stargate.lore.entries.${lore.key}.risk`, lore.risk),
            intel: t(`stargate.lore.entries.${lore.key}.intel`, lore.intel),
            tactical: t(`stargate.lore.entries.${lore.key}.tactical`, lore.tactical),
        }
    }

    return {
        worldType: t('stargate.lore.fallback.worldType', 'Uncatalogued world profile'),
        faction: t('stargate.lore.fallback.faction', 'Mixed / unknown local actors'),
        risk: t('stargate.lore.fallback.risk', 'MEDIUM'),
        intel: t('stargate.lore.fallback.intel', {
            defaultValue: 'Documented gate destination referenced in {{episode}}. Additional anthropological and strategic reconnaissance pending.',
            episode: addr.episode,
        }),
        tactical: t('stargate.lore.fallback.tactical', 'Treat as limited-intelligence deployment. Use standard SG perimeter and first-contact protocol.'),
    }
}

function CopyGlyphButton({ glyphs, copyLabel = 'Copy glyphs', copiedLabel = 'Copied!' }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(glyphs.join(' ')).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        })
    }

    return (
        <Tooltip title={copied ? copiedLabel : copyLabel} placement="left">
            <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                    color: copied ? '#66bb6a' : 'rgba(79,195,247,0.35)',
                    p: '3px',
                    '&:hover': { color: copied ? '#66bb6a' : '#4fc3f7' },
                }}
            >
                {copied
                    ? <CheckIcon sx={{ fontSize: 13 }} />
                    : <ContentCopyIcon sx={{ fontSize: 13 }} />}
            </IconButton>
        </Tooltip>
    )
}

function GlyphBadge({ n }) {
    const { t } = useTranslation()
    const pad = String(n).padStart(2, '0')
    // Each glyph number is unique per address row, so filter ID collisions are harmless
    // (all same-n filters are identical; browser uses whichever it finds first).
    const fid = `gbf-${n}`
    return (
        <Box
            component="span"
            title={t('stargate.addresses.glyphTitle', { defaultValue: 'Glyph {{n}}', n })}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: '1px solid rgba(79,195,247,0.35)',
                bgcolor: 'rgba(79,195,247,0.08)',
                flexShrink: 0,
            }}
        >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: 'block' }}>
                <defs>
                    <filter id={fid} colorInterpolationFilters="sRGB"
                        x="0%" y="0%" width="100%" height="100%">
                        <feColorMatrix type="matrix" values={
                            '0 0 0 0 0.31 ' +
                            '0 0 0 0 0.76 ' +
                            '0 0 0 0 0.97 ' +
                            '-0.333 -0.333 -0.333 0 1'
                        } />
                    </filter>
                </defs>
                <image
                    href={`/stargate/glyphs/glyph${pad}.png`}
                    x="0" y="0" width="18" height="18"
                    filter={`url(#${fid})`}
                />
            </svg>
        </Box>
    )
}

export default function FloorPlan({ selectedRoom, onRoomSelect }) {
    const { t } = useTranslation()
    const [level, setLevel] = useState(28)

    // Gate tab state
    const [dialingAddrName, setDialingAddrName] = useState('')
    const [dialKey, setDialKey] = useState(0)
    const [loreAddr, setLoreAddr] = useState(null)
    const [loreOpen, setLoreOpen] = useState(false)
    const [gateMode, setGateMode] = useState('addresses')
    const [manualGlyphs, setManualGlyphs] = useState([])
    const [manualResult, setManualResult] = useState(null)
    const [timelineYear, setTimelineYear] = useState('all')
    const forcedAddrRef = useRef(null)

    const handleDialAddress = useCallback((addr) => {
        forcedAddrRef.current = addr
        setDialKey(k => k + 1)
    }, [])

    const openLoreDrawer = useCallback((addr, e) => {
        e.stopPropagation()
        setLoreAddr(addr)
        setLoreOpen(true)
    }, [])

    const closeLoreDrawer = useCallback(() => {
        setLoreOpen(false)
    }, [])

    const pushGlyph = useCallback((n) => {
        setManualGlyphs(prev => {
            if (prev.length >= 6) return prev
            return [...prev, n]
        })
        setManualResult(null)
    }, [])

    const popGlyph = useCallback(() => {
        setManualGlyphs(prev => prev.slice(0, -1))
        setManualResult(null)
    }, [])

    const clearGlyphs = useCallback(() => {
        setManualGlyphs([])
        setManualResult(null)
    }, [])

    const validateManualAddress = useCallback(() => {
        if (manualGlyphs.length !== 6) return
        const match = STARGATE_ADDRESSES.find(addr =>
            addr.glyphs.every((g, i) => g === manualGlyphs[i])
        )
        if (match) {
            setManualResult({ ok: true, addr: match })
            return
        }
        setManualResult({ ok: false })
    }, [manualGlyphs])

    const focusRoomFromTimeline = useCallback((roomId) => {
        if (!roomId) return
        onRoomSelect?.(roomId)
        if (roomId.startsWith('l27-')) setLevel(27)
        if (roomId.startsWith('l28-')) setLevel(28)
    }, [onRoomSelect])

    const activeLore = loreAddr ? getAddressLore(loreAddr, t) : null
    const timelineYears = ['all', ...Array.from(new Set(STARGATE_TIMELINE.map(e => e.year))).sort((a, b) => a - b)]
    const filteredTimeline = timelineYear === 'all'
        ? STARGATE_TIMELINE
        : STARGATE_TIMELINE.filter(e => e.year === timelineYear)

    return (
        <Box>
            {/* Level switcher */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs
                    value={level}
                    onChange={(_, v) => setLevel(v)}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    textColor="inherit"
                    TabIndicatorProps={{ style: { backgroundColor: '#4fc3f7' } }}
                    sx={{
                        maxWidth: '100%',
                        '& .MuiTabs-scrollButtons': {
                            color: 'rgba(79,195,247,0.7)',
                        },
                        '& .MuiTab-root': {
                            color: 'rgba(79,195,247,0.55)',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            fontSize: '0.75rem',
                            border: '1px solid rgba(79,195,247,0.2)',
                            mx: 0.5,
                            borderRadius: '4px',
                            '&.Mui-selected': {
                                color: '#4fc3f7',
                                borderColor: '#4fc3f7',
                            },
                        },
                    }}
                >
                    <Tab label={t('stargate.tabs.level28', 'LEVEL 28 - GATE OPS')} value={28} />
                    <Tab label={t('stargate.tabs.level27', 'LEVEL 27 - ADMIN')} value={27} />
                    <Tab label={t('stargate.tabs.addresses', 'GATE - KNOWN ADDRESSES')} value="gate" />
                    <Tab label={t('stargate.members.tabLabel', 'SGC — KNOWN PERSONNEL')} value="members" />
                    <Tab label={t('stargate.tabs.timeline', 'STARGATE TIMELINE')} value="timeline" />
                </Tabs>
            </Box>

            {/* SVG floor plan */}
            {(level === 27 || level === 28) && (
                <>
                    <Box
                        sx={{
                            borderRadius: '8px',
                            border: '1px solid rgba(79,195,247,0.18)',
                            overflow: 'hidden',
                            background: '#060f1e',
                            boxShadow: '0 0 40px rgba(79,195,247,0.06)',
                        }}
                    >
                        {level === 27 ? (
                            <Level27Plan selectedRoom={selectedRoom} onRoomSelect={onRoomSelect} />
                        ) : (
                            <Level28Plan selectedRoom={selectedRoom} onRoomSelect={onRoomSelect} />
                        )}
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 1.5, color: 'rgba(179,229,252,0.4)', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                        {t('stargate.ui.clickRoomHint', 'CLICK A ROOM TO ACCESS CLASSIFIED INFORMATION')}
                    </Box>
                </>
            )}

            {/* Gate + known addresses tab */}
            {level === 'gate' && (
                <Box
                    sx={{
                        borderRadius: '8px',
                        border: '1px solid rgba(79,195,247,0.18)',
                        background: '#060f1e',
                        boxShadow: '0 0 40px rgba(79,195,247,0.06)',
                        px: { xs: 2, md: 5 },
                        py: 4,
                    }}
                >
                    {/* Big dialing gate */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <AnimatedStargate
                            size={450}
                            dialing
                            forcedAddress={forcedAddrRef.current}
                            dialKey={dialKey}
                            onAddressChange={setDialingAddrName}
                        />
                    </Box>

                    {/* Section header */}
                    <Box sx={{ borderBottom: '1px solid rgba(79,195,247,0.18)', mb: 2, pb: 1 }}>
                        <Typography sx={{
                            fontSize: '0.58rem',
                            fontFamily: "'Courier New', monospace",
                            letterSpacing: '0.2em',
                            color: 'rgba(79,195,247,0.5)',
                            fontWeight: 700,
                        }}>
                            {t('stargate.addresses.title', 'MILKY WAY GATE NETWORK - VERIFIED COORDINATES')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.7, mb: 2.1, flexWrap: 'wrap' }}>
                        <Button
                            size="small"
                            onClick={() => setGateMode('addresses')}
                            sx={{
                                color: gateMode === 'addresses' ? '#e0f7fa' : 'rgba(179,229,252,0.7)',
                                border: '1px solid rgba(79,195,247,0.28)',
                                bgcolor: gateMode === 'addresses' ? 'rgba(79,195,247,0.16)' : 'transparent',
                            }}
                        >
                            {t('stargate.gateModes.knownAddresses', 'Known Addresses')}
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setGateMode('sim')}
                            sx={{
                                color: gateMode === 'sim' ? '#e0f7fa' : 'rgba(179,229,252,0.7)',
                                border: '1px solid rgba(79,195,247,0.28)',
                                bgcolor: gateMode === 'sim' ? 'rgba(79,195,247,0.16)' : 'transparent',
                            }}
                        >
                            {t('stargate.gateModes.simulator', 'Dialing Mini-Game')}
                        </Button>
                    </Box>

                    {gateMode === 'addresses' && (
                        <>
                            {/* Column headers */}
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr auto', sm: '1fr 160px auto' },
                                px: 1.5,
                                py: 0.75,
                                bgcolor: 'rgba(79,195,247,0.05)',
                                borderRadius: '3px 3px 0 0',
                                border: '1px solid rgba(79,195,247,0.12)',
                                borderBottom: 'none',
                            }}>
                                {[
                                    t('stargate.addresses.columns.designation', 'DESIGNATION'),
                                    t('stargate.addresses.columns.episode', 'EPISODE REF'),
                                    t('stargate.addresses.columns.glyphs', 'ADDRESS GLYPHS'),
                                ].map((h, hi) => (
                                    <Typography key={h} sx={{
                                        fontSize: '0.5rem',
                                        fontFamily: "'Courier New', monospace",
                                        letterSpacing: '0.16em',
                                        color: 'rgba(79,195,247,0.55)',
                                        fontWeight: 700,
                                        display: hi === 1 ? { xs: 'none', sm: 'block' } : 'block',
                                    }}>{h}</Typography>
                                ))}
                            </Box>

                            {/* Address rows */}
                            <Box sx={{
                                border: '1px solid rgba(79,195,247,0.12)',
                                borderRadius: '0 0 3px 3px',
                                overflow: 'hidden',
                            }}>
                                {STARGATE_ADDRESSES.map((addr, i) => {
                                    const isDialing = dialingAddrName === addr.name
                                    return (
                                        <Box
                                            key={addr.name}
                                            onClick={() => handleDialAddress(addr)}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: { xs: '1fr auto', sm: '1fr 160px auto' },
                                                alignItems: 'center',
                                                px: 1.5,
                                                py: 0.9,
                                                borderTop: i === 0 ? 'none' : '1px solid rgba(79,195,247,0.07)',
                                                borderLeft: isDialing ? '3px solid rgba(79,195,247,0.7)' : '3px solid transparent',
                                                bgcolor: isDialing
                                                    ? 'rgba(79,195,247,0.1)'
                                                    : i % 2 === 0 ? 'transparent' : 'rgba(79,195,247,0.025)',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s, border-color 0.2s',
                                                '&:hover': {
                                                    bgcolor: isDialing
                                                        ? 'rgba(79,195,247,0.14)'
                                                        : 'rgba(79,195,247,0.07)',
                                                },
                                            }}
                                        >
                                            {/* Name */}
                                            <Typography sx={{
                                                fontSize: '0.72rem',
                                                fontFamily: "'Courier New', monospace",
                                                color: isDialing ? '#e0f7fa' : '#b3e5fc',
                                                fontWeight: isDialing ? 700 : 600,
                                                letterSpacing: '0.06em',
                                            }}>
                                                {addr.name}
                                            </Typography>

                                            {/* Episode — hidden on xs */}
                                            <Typography sx={{
                                                fontSize: '0.62rem',
                                                fontFamily: "'Courier New', monospace",
                                                color: 'rgba(179,229,252,0.4)',
                                                letterSpacing: '0.04em',
                                                fontStyle: 'italic',
                                                pr: 1,
                                                display: { xs: 'none', sm: 'block' },
                                            }}>
                                                {addr.episode}
                                            </Typography>

                                            {/* Glyphs + lore + copy */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {addr.glyphs.map((g, gi) => (
                                                    <GlyphBadge key={gi} n={g} />
                                                ))}
                                                <Tooltip title={t('stargate.addresses.openIntel', 'Open intel file')} placement="left">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => openLoreDrawer(addr, e)}
                                                        sx={{
                                                            color: 'rgba(79,195,247,0.35)',
                                                            p: '3px',
                                                            '&:hover': { color: '#4fc3f7' },
                                                        }}
                                                    >
                                                        <MenuBookOutlinedIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <CopyGlyphButton
                                                    glyphs={addr.glyphs}
                                                    copyLabel={t('stargate.addresses.copyGlyphs', 'Copy glyphs')}
                                                    copiedLabel={t('stargate.addresses.copied', 'Copied!')}
                                                />
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Box>

                            <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                <Typography sx={{
                                    fontSize: '0.5rem',
                                    fontFamily: "'Courier New', monospace",
                                    color: 'rgba(79,195,247,0.4)',
                                    letterSpacing: '0.1em',
                                }}>
                                    {t('stargate.addresses.hint', 'CLICK ROW TO DIAL // BOOK ICON OPENS LORE FILE')}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.5rem',
                                    fontFamily: "'Courier New', monospace",
                                    color: 'rgba(233,69,96,0.45)',
                                    letterSpacing: '0.1em',
                                }}>
                                    {t('stargate.addresses.footer', {
                                        defaultValue: '{{count}} VERIFIED ADDRESSES - CLASSIFIED // SCI CHANNELS ONLY',
                                        count: STARGATE_ADDRESSES.length,
                                    })}
                                </Typography>
                            </Box>
                        </>
                    )}

                    {gateMode === 'sim' && (
                        <>
                            <Typography sx={{
                                fontSize: '0.72rem',
                                color: 'rgba(179,229,252,0.78)',
                                mb: 1.2,
                            }}>
                                {t('stargate.sim.instructions', 'Select 6 destination glyphs, then validate against the known SGC address database. The 7th chevron locks the origin symbol automatically.')}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flexWrap: 'wrap', mb: 1.3 }}>
                                {Array.from({ length: 6 }, (_, i) => (
                                    <Box key={i} sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '4px',
                                        border: '1px solid rgba(79,195,247,0.25)',
                                        bgcolor: 'rgba(79,195,247,0.06)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {manualGlyphs[i] ? <GlyphBadge n={manualGlyphs[i]} /> : <Typography sx={{ fontSize: '0.58rem', color: 'rgba(79,195,247,0.35)' }}>{i + 1}</Typography>}
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 1.8 }}>
                                <Button
                                    variant="outlined"
                                    onClick={popGlyph}
                                    disabled={manualGlyphs.length === 0}
                                    sx={{ color: '#4fc3f7', borderColor: 'rgba(79,195,247,0.35)' }}
                                >
                                    {t('stargate.sim.backspace', 'Backspace')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={clearGlyphs}
                                    disabled={manualGlyphs.length === 0}
                                    sx={{ color: '#4fc3f7', borderColor: 'rgba(79,195,247,0.35)' }}
                                >
                                    {t('stargate.sim.clear', 'Clear')}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={validateManualAddress}
                                    disabled={manualGlyphs.length !== 6}
                                    sx={{
                                        bgcolor: '#0b3d5e',
                                        color: '#e0f7fa',
                                        '&:hover': { bgcolor: '#145785' },
                                    }}
                                >
                                    {t('stargate.sim.validate', 'Validate Address')}
                                </Button>
                            </Box>

                            {manualResult && (
                                <Box sx={{
                                    border: `1px solid ${manualResult.ok ? 'rgba(102,187,106,0.45)' : 'rgba(233,69,96,0.45)'}`,
                                    bgcolor: manualResult.ok ? 'rgba(102,187,106,0.08)' : 'rgba(233,69,96,0.08)',
                                    borderRadius: '6px',
                                    p: 1.2,
                                    mb: 1.8,
                                }}>
                                    {manualResult.ok ? (
                                        <>
                                            <Typography sx={{ color: '#a5d6a7', fontWeight: 700, mb: 0.5 }}>
                                                {t('stargate.sim.match', { defaultValue: 'Valid destination: {{name}}', name: manualResult.addr.name })}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(179,229,252,0.75)', fontSize: '0.72rem', mb: 0.9 }}>
                                                {t('stargate.sim.matchEpisode', { defaultValue: 'Reference episode: {{episode}}', episode: manualResult.addr.episode })}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setGateMode('addresses')
                                                    handleDialAddress(manualResult.addr)
                                                }}
                                                sx={{ color: '#4fc3f7', borderColor: 'rgba(79,195,247,0.35)' }}
                                            >
                                                {t('stargate.sim.dialNow', 'Dial This Address')}
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography sx={{ color: '#ef9a9a', fontWeight: 700 }}>
                                            {t('stargate.sim.noMatch', 'No match in known address registry. Check glyph sequence and retry.')}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(6, 1fr)', sm: 'repeat(13, 1fr)' },
                                gap: 0.55,
                            }}>
                                {Array.from({ length: 39 }, (_, i) => i + 1).map(n => (
                                    <Button
                                        key={n}
                                        onClick={() => pushGlyph(n)}
                                        disabled={manualGlyphs.length >= 6}
                                        sx={{
                                            minWidth: 0,
                                            p: 0.3,
                                            border: '1px solid rgba(79,195,247,0.2)',
                                            bgcolor: 'rgba(79,195,247,0.04)',
                                            '&:hover': { bgcolor: 'rgba(79,195,247,0.1)' },
                                        }}
                                    >
                                        <GlyphBadge n={n} />
                                    </Button>
                                ))}
                            </Box>
                        </>
                    )}
                </Box>
            )}

            {/* Known SGC members tab */}
            {level === 'members' && (
                <Box
                    sx={{
                        borderRadius: '8px',
                        border: '1px solid rgba(79,195,247,0.18)',
                        background: '#060f1e',
                        boxShadow: '0 0 40px rgba(79,195,247,0.06)',
                        px: { xs: 2, md: 3 },
                        py: 3,
                    }}
                >
                    <Box sx={{ borderBottom: '1px solid rgba(79,195,247,0.18)', mb: 2, pb: 1 }}>
                        <Typography sx={{
                            fontSize: '0.58rem',
                            fontFamily: "'Courier New', monospace",
                            letterSpacing: '0.2em',
                            color: 'rgba(79,195,247,0.5)',
                            fontWeight: 700,
                        }}>
                            {t('stargate.members.title', 'STARGATE COMMAND PERSONNEL INDEX — KNOWN MEMBERS')}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 1.2,
                    }}>
                        {SGC_MEMBERS.map((m) => (
                            <Box
                                key={m.name}
                                sx={{
                                    border: '1px solid rgba(79,195,247,0.15)',
                                    borderRadius: '6px',
                                    p: 1.2,
                                    background: 'linear-gradient(140deg, rgba(79,195,247,0.05), rgba(79,195,247,0.01))',
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.78rem',
                                    fontFamily: "'Courier New', monospace",
                                    color: '#e0f7fa',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    mb: 0.35,
                                }}>
                                    {m.name}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.64rem',
                                    fontFamily: "'Courier New', monospace",
                                    color: 'rgba(79,195,247,0.8)',
                                    letterSpacing: '0.06em',
                                    mb: 0.75,
                                }}>
                                    {t(`stargate.members.entries.${m.id}.rank`, m.rank)}
                                </Typography>

                                <MemberField
                                    label={t('stargate.members.labels.assignment', 'ASSIGNMENT')}
                                    value={t(`stargate.members.entries.${m.id}.assignment`, m.assignment)}
                                />
                                <MemberField
                                    label={t('stargate.members.labels.specialty', 'SPECIALTY')}
                                    value={t(`stargate.members.entries.${m.id}.specialty`, m.specialty)}
                                />
                                <MemberField
                                    label={t('stargate.members.labels.status', 'STATUS')}
                                    value={t(`stargate.members.entries.${m.id}.status`, m.status)}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ mt: 1.4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Typography sx={{
                            fontSize: '0.5rem',
                            fontFamily: "'Courier New', monospace",
                            color: 'rgba(79,195,247,0.4)',
                            letterSpacing: '0.1em',
                        }}>
                            {t('stargate.members.footerLeft', 'ROSTER CONSOLIDATED FROM KNOWN SGC ERA PERSONNEL RECORDS')}
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.5rem',
                            fontFamily: "'Courier New', monospace",
                            color: 'rgba(233,69,96,0.45)',
                            letterSpacing: '0.1em',
                        }}>
                            {t('stargate.members.footerRight', {
                                defaultValue: '{{count}} KNOWN MEMBERS — CLASSIFIED // PERSONNEL CHANNEL',
                                count: SGC_MEMBERS.length,
                            })}
                        </Typography>
                    </Box>
                </Box>
            )}

            {level === 'timeline' && (
                <Box
                    sx={{
                        borderRadius: '8px',
                        border: '1px solid rgba(79,195,247,0.18)',
                        background: '#060f1e',
                        boxShadow: '0 0 40px rgba(79,195,247,0.06)',
                        px: { xs: 2, md: 3 },
                        py: 3,
                    }}
                >
                    <Box sx={{ borderBottom: '1px solid rgba(79,195,247,0.18)', mb: 2, pb: 1 }}>
                        <Typography sx={{
                            fontSize: '0.58rem',
                            fontFamily: "'Courier New', monospace",
                            letterSpacing: '0.2em',
                            color: 'rgba(79,195,247,0.5)',
                            fontWeight: 700,
                        }}>
                            {t('stargate.timeline.title', 'STARGATE PROGRAM TIMELINE')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mb: 2 }}>
                        {timelineYears.map(y => (
                            <Button
                                key={y}
                                onClick={() => setTimelineYear(y)}
                                size="small"
                                sx={{
                                    color: timelineYear === y ? '#e0f7fa' : 'rgba(179,229,252,0.65)',
                                    border: '1px solid rgba(79,195,247,0.25)',
                                    bgcolor: timelineYear === y ? 'rgba(79,195,247,0.18)' : 'transparent',
                                }}
                            >
                                {y === 'all' ? t('stargate.timeline.allYears', 'All years') : y}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: 'grid', gap: 1.1 }}>
                        {filteredTimeline.map(event => (
                            <Box key={event.id} sx={{
                                border: '1px solid rgba(79,195,247,0.15)',
                                borderRadius: '6px',
                                p: 1.25,
                                background: 'linear-gradient(140deg, rgba(79,195,247,0.05), rgba(79,195,247,0.01))',
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 0.6 }}>
                                    <Typography sx={{ color: '#4fc3f7', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                                        {event.year} - {event.title}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(179,229,252,0.5)', fontSize: '0.68rem', fontStyle: 'italic' }}>
                                        {event.episode}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: 'rgba(179,229,252,0.82)', fontSize: '0.74rem', lineHeight: 1.55, mb: 0.9 }}>
                                    {event.description}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 0.7, flexWrap: 'wrap' }}>
                                    {event.roomId && (
                                        <Button
                                            size="small"
                                            onClick={() => focusRoomFromTimeline(event.roomId)}
                                            sx={{ color: '#4fc3f7', border: '1px solid rgba(79,195,247,0.28)' }}
                                        >
                                            {t('stargate.timeline.focusRoom', 'Focus Room')}
                                        </Button>
                                    )}
                                    {event.addressName && (
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const addr = STARGATE_ADDRESSES.find(a => a.name === event.addressName)
                                                if (!addr) return
                                                setLevel('gate')
                                                handleDialAddress(addr)
                                            }}
                                            sx={{ color: '#4fc3f7', border: '1px solid rgba(79,195,247,0.28)' }}
                                        >
                                            {t('stargate.timeline.dialEventAddress', 'Dial Event Address')}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            <Drawer
                anchor="right"
                open={loreOpen}
                onClose={closeLoreDrawer}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 420 },
                        bgcolor: '#040b18',
                        borderLeft: '1px solid rgba(79,195,247,0.22)',
                        color: '#b3e5fc',
                        backgroundImage: 'radial-gradient(circle at 18% 10%, rgba(79,195,247,0.15), transparent 55%)',
                    },
                }}
            >
                {loreAddr && (
                    <Box sx={{ p: 2.2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                            <Box>
                                <Typography sx={{
                                    fontSize: '0.54rem',
                                    fontFamily: "'Courier New', monospace",
                                    letterSpacing: '0.18em',
                                    color: 'rgba(79,195,247,0.55)',
                                    mb: 0.5,
                                }}>
                                    {t('stargate.lore.fileTitle', 'DESTINATION INTELLIGENCE FILE')}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '1.02rem',
                                    fontFamily: "'Courier New', monospace",
                                    letterSpacing: '0.08em',
                                    color: '#e0f7fa',
                                    fontWeight: 700,
                                }}>
                                    {loreAddr.name}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.65rem',
                                    fontFamily: "'Courier New', monospace",
                                    letterSpacing: '0.05em',
                                    color: 'rgba(179,229,252,0.45)',
                                    fontStyle: 'italic',
                                    mt: 0.4,
                                }}>
                                    {t('stargate.lore.episodeReference', {
                                        defaultValue: 'Episode reference: {{episode}}',
                                        episode: loreAddr.episode,
                                    })}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={closeLoreDrawer}
                                size="small"
                                sx={{ color: 'rgba(179,229,252,0.45)' }}
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(79,195,247,0.16)', my: 1.7 }} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.2 }}>
                            <LoreField label={t('stargate.lore.labels.worldType', 'WORLD TYPE')} value={activeLore.worldType} />
                            <LoreField label={t('stargate.lore.labels.faction', 'PRIMARY FACTION')} value={activeLore.faction} />
                            <LoreField label={t('stargate.lore.labels.risk', 'THREAT RATING')} value={activeLore.risk} />
                        </Box>

                        <Box sx={{ mt: 2.1 }}>
                            <Typography sx={{
                                fontSize: '0.56rem',
                                fontFamily: "'Courier New', monospace",
                                letterSpacing: '0.16em',
                                color: 'rgba(79,195,247,0.55)',
                                mb: 0.7,
                            }}>
                                {t('stargate.lore.labels.intelSummary', 'INTELLIGENCE SUMMARY')}
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.78rem',
                                lineHeight: 1.55,
                                color: 'rgba(179,229,252,0.86)',
                            }}>
                                {activeLore.intel}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 2.1 }}>
                            <Typography sx={{
                                fontSize: '0.56rem',
                                fontFamily: "'Courier New', monospace",
                                letterSpacing: '0.16em',
                                color: 'rgba(79,195,247,0.55)',
                                mb: 0.7,
                            }}>
                                {t('stargate.lore.labels.tacticalNotes', 'TACTICAL NOTES')}
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.78rem',
                                lineHeight: 1.55,
                                color: 'rgba(179,229,252,0.86)',
                            }}>
                                {activeLore.tactical}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 'auto', pt: 2.2, display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    handleDialAddress(loreAddr)
                                    closeLoreDrawer()
                                }}
                                sx={{
                                    color: '#4fc3f7',
                                    borderColor: 'rgba(79,195,247,0.45)',
                                    fontSize: '0.62rem',
                                    fontFamily: "'Courier New', monospace",
                                    letterSpacing: '0.1em',
                                    px: 1.2,
                                    py: 0.5,
                                    '&:hover': {
                                        borderColor: '#4fc3f7',
                                        bgcolor: 'rgba(79,195,247,0.08)',
                                    },
                                }}
                            >
                                {t('stargate.lore.dialDestination', 'DIAL DESTINATION')}
                            </Button>
                            <Button
                                variant="text"
                                onClick={closeLoreDrawer}
                                sx={{
                                    color: 'rgba(179,229,252,0.7)',
                                    fontSize: '0.62rem',
                                    fontFamily: "'Courier New', monospace",
                                    letterSpacing: '0.1em',
                                }}
                            >
                                {t('stargate.lore.close', 'CLOSE')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </Box>
    )
}

function LoreField({ label, value }) {
    return (
        <Box>
            <Typography sx={{
                fontSize: '0.52rem',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.14em',
                color: 'rgba(79,195,247,0.5)',
                mb: 0.2,
            }}>
                {label}
            </Typography>
            <Typography sx={{
                fontSize: '0.75rem',
                color: 'rgba(179,229,252,0.9)',
                lineHeight: 1.4,
            }}>
                {value}
            </Typography>
        </Box>
    )
}

function MemberField({ label, value }) {
    return (
        <Box sx={{ mb: 0.45 }}>
            <Typography sx={{
                fontSize: '0.5rem',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.12em',
                color: 'rgba(79,195,247,0.5)',
                mb: 0.1,
            }}>
                {label}
            </Typography>
            <Typography sx={{
                fontSize: '0.69rem',
                color: 'rgba(179,229,252,0.86)',
                lineHeight: 1.35,
            }}>
                {value}
            </Typography>
        </Box>
    )
}
