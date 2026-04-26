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

const ADDRESS_LORE = {
    ABYDOS: {
        worldType: 'Desert world / Ancient cultural nexus',
        faction: 'Abydonians, Tau\'ri allied',
        risk: 'MEDIUM',
        intel: 'First off-world destination reached by Earth in the modern Stargate era. Historical inscriptions here were key to decoding gate travel.',
        tactical: 'Population generally friendly. Maintain cultural protocols and avoid contaminating local political structures.',
    },
    CHULAK: {
        worldType: 'Goa\'uld-controlled feudal world',
        faction: 'Jaffa of Apophis (historical)',
        risk: 'HIGH',
        intel: 'Major operational theater tied to Apophis and early resistance contacts including Teal\'c.',
        tactical: 'Expect patrols, heavy staff-weapon presence, and rapid escalation if identity is compromised.',
    },
    TOLLAN: {
        worldType: 'Advanced technocratic world',
        faction: 'Tollan',
        risk: 'LOW',
        intel: 'Technologically superior but politically isolationist civilization with strict non-interference doctrine.',
        tactical: 'Diplomatic posture recommended. Technical exchange is highly restricted.',
    },
    TOLLANA: {
        worldType: 'Relocated Tollan colony world',
        faction: 'Tollan survivors',
        risk: 'MEDIUM',
        intel: 'Successor settlement after Tollan evacuation. Politically sensitive and vulnerable to Goa\'uld manipulation.',
        tactical: 'Intel value high. Prioritize political threat assessment over direct engagement.',
    },
    KHEB: {
        worldType: 'Sacred ascension site',
        faction: 'Unaffiliated spiritual enclave',
        risk: 'LOW',
        intel: 'Rarely visited world associated with Ancient knowledge and ascension-era mythology.',
        tactical: 'Minimal force posture. Scientific and cultural teams preferred.',
    },
    TARTARUS: {
        worldType: 'Industrial prison and labor world',
        faction: 'Goa\'uld / Jaffa infrastructure',
        risk: 'EXTREME',
        intel: 'Critical enemy logistics and detention location linked to high-value prisoner and military movement.',
        tactical: 'Hostile environment. Covert infiltration only with extraction window pre-planned.',
    },
    'PRACLARUSH TAONAS': {
        worldType: 'Ancient city-world ruin',
        faction: 'Ancient infrastructure remnants',
        risk: 'HIGH',
        intel: 'Site tied to strategic Ancient systems and long-range defense assets.',
        tactical: 'Ancient tech can be unstable. Bring technical containment and hazard response kits.',
    },
    EURONDA: {
        worldType: 'Militarized authoritarian state world',
        faction: 'Eurondan regime',
        risk: 'HIGH',
        intel: 'Contact scenario demonstrated severe ideological and humanitarian risk factors.',
        tactical: 'Strict engagement controls and deep political vetting mandatory.',
    },
    EDORA: {
        worldType: 'Agrarian world with stellar anomaly exposure',
        faction: 'Edoran civilians',
        risk: 'MEDIUM',
        intel: 'Known for periodic environmental hazards linked to unusual stellar behavior.',
        tactical: 'Deploy atmospheric and radiation monitoring on arrival.',
    },
    'EARTH (Beta Gate)': {
        worldType: 'Earth-linked alternate gate scenario',
        faction: 'Tau\'ri internal',
        risk: 'LOW',
        intel: 'Important historical incident for understanding dual-gate routing and inbound/outbound edge cases.',
        tactical: 'Primary value is procedural validation, not field conflict.',
    },
}

function getAddressLore(addr) {
    const lore = ADDRESS_LORE[addr.name]
    if (lore) return lore

    return {
        worldType: 'Uncatalogued world profile',
        faction: 'Mixed / unknown local actors',
        risk: 'MEDIUM',
        intel: `Documented gate destination referenced in ${addr.episode}. Additional anthropological and strategic reconnaissance pending.`,
        tactical: 'Treat as limited-intelligence deployment. Use standard SG perimeter and first-contact protocol.',
    }
}

function CopyGlyphButton({ glyphs }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(glyphs.join(' ')).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        })
    }

    return (
        <Tooltip title={copied ? 'Copied!' : 'Copy glyphs'} placement="left">
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
    const pad = String(n).padStart(2, '0')
    // Each glyph number is unique per address row, so filter ID collisions are harmless
    // (all same-n filters are identical; browser uses whichever it finds first).
    const fid = `gbf-${n}`
    return (
        <Box
            component="span"
            title={`Glyph ${n}`}
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
    const [level, setLevel] = useState(28)

    // Gate tab state
    const [dialingAddrName, setDialingAddrName] = useState('')
    const [dialKey, setDialKey] = useState(0)
    const [loreAddr, setLoreAddr] = useState(null)
    const [loreOpen, setLoreOpen] = useState(false)
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

    return (
        <Box>
            {/* Level switcher */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs
                    value={level}
                    onChange={(_, v) => setLevel(v)}
                    textColor="inherit"
                    TabIndicatorProps={{ style: { backgroundColor: '#4fc3f7' } }}
                    sx={{
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
                    <Tab label="LEVEL 28 — GATE OPS" value={28} />
                    <Tab label="LEVEL 27 — ADMIN" value={27} />
                    <Tab label="GATE — KNOWN ADDRESSES" value="gate" />
                </Tabs>
            </Box>

            {/* SVG floor plan */}
            {level !== 'gate' && (
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
                        CLICK A ROOM TO ACCESS CLASSIFIED INFORMATION
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
                            MILKY WAY GATE NETWORK — VERIFIED COORDINATES
                        </Typography>
                    </Box>

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
                        {['DESIGNATION', 'EPISODE REF', 'ADDRESS GLYPHS'].map((h, hi) => (
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
                                        <Tooltip title="Open intel file" placement="left">
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
                                        <CopyGlyphButton glyphs={addr.glyphs} />
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
                            CLICK ROW TO DIAL // BOOK ICON OPENS LORE FILE
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.5rem',
                            fontFamily: "'Courier New', monospace",
                            color: 'rgba(233,69,96,0.45)',
                            letterSpacing: '0.1em',
                        }}>
                            {STARGATE_ADDRESSES.length} VERIFIED ADDRESSES — CLASSIFIED // SCI CHANNELS ONLY
                        </Typography>
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
                                    DESTINATION INTELLIGENCE FILE
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
                                    Episode reference: {loreAddr.episode}
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
                            <LoreField label="WORLD TYPE" value={getAddressLore(loreAddr).worldType} />
                            <LoreField label="PRIMARY FACTION" value={getAddressLore(loreAddr).faction} />
                            <LoreField label="THREAT RATING" value={getAddressLore(loreAddr).risk} />
                        </Box>

                        <Box sx={{ mt: 2.1 }}>
                            <Typography sx={{
                                fontSize: '0.56rem',
                                fontFamily: "'Courier New', monospace",
                                letterSpacing: '0.16em',
                                color: 'rgba(79,195,247,0.55)',
                                mb: 0.7,
                            }}>
                                INTELLIGENCE SUMMARY
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.78rem',
                                lineHeight: 1.55,
                                color: 'rgba(179,229,252,0.86)',
                            }}>
                                {getAddressLore(loreAddr).intel}
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
                                TACTICAL NOTES
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.78rem',
                                lineHeight: 1.55,
                                color: 'rgba(179,229,252,0.86)',
                            }}>
                                {getAddressLore(loreAddr).tactical}
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
                                DIAL DESTINATION
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
                                CLOSE
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
