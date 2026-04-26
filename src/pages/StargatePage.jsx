import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Button,
    Chip,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import FloorPlan from '../components/stargate/FloorPlan'
import AnimatedStargate from '../components/stargate/AnimatedStargate'
import { getRoomById, facilityLevels, tierMeta } from '../data/stargateRooms'
import LanguageSwitcher from '../components/LanguageSwitcher'

/* ─── Lightbox ─── */
function Lightbox({ screenshots, index, onClose }) {
    const [current, setCurrent] = useState(index)
    const total = screenshots.length

    const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])
    const next = useCallback(() => setCurrent(i => (i + 1) % total), [total])

    useEffect(() => {
        const handler = e => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose, prev, next])

    return (
        <Box
            onClick={onClose}
            sx={{
                position: 'fixed', inset: 0, zIndex: 2000,
                bgcolor: 'rgba(4,11,24,0.96)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            {/* Prev */}
            {total > 1 && (
                <IconButton
                    onClick={e => { e.stopPropagation(); prev() }}
                    sx={{
                        position: 'absolute', left: 16,
                        color: '#4fc3f7', bgcolor: 'rgba(79,195,247,0.1)',
                        '&:hover': { bgcolor: 'rgba(79,195,247,0.22)' },
                    }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>
            )}

            {/* Image */}
            <Box
                component="img"
                src={screenshots[current]}
                alt={`screenshot ${current + 1}`}
                onClick={e => e.stopPropagation()}
                sx={{
                    maxWidth: '90vw', maxHeight: '88vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 0 60px rgba(79,195,247,0.2)',
                    border: '1px solid rgba(79,195,247,0.25)',
                }}
            />

            {/* Next */}
            {total > 1 && (
                <IconButton
                    onClick={e => { e.stopPropagation(); next() }}
                    sx={{
                        position: 'absolute', right: 16,
                        color: '#4fc3f7', bgcolor: 'rgba(79,195,247,0.1)',
                        '&:hover': { bgcolor: 'rgba(79,195,247,0.22)' },
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            )}

            {/* Close */}
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', top: 12, right: 12, color: 'rgba(179,229,252,0.5)' }}
            >
                <CloseIcon />
            </IconButton>

            {/* Counter */}
            {total > 1 && (
                <Typography
                    sx={{
                        position: 'absolute', bottom: 16,
                        fontSize: '0.72rem', color: 'rgba(79,195,247,0.5)',
                        letterSpacing: '0.1em',
                    }}
                >
                    {current + 1} / {total}
                </Typography>
            )}
        </Box>
    )
}

/* ─── Screenshot with graceful fallback ─── */
function Screenshot({ src, alt, onClick }) {
    const [broken, setBroken] = useState(false)

    if (broken) {
        return (
            <Box
                sx={{
                    width: 220,
                    height: 140,
                    flexShrink: 0,
                    borderRadius: '6px',
                    border: '1px dashed rgba(79,195,247,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(179,229,252,0.3)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                }}
            >
                NO IMAGE
            </Box>
        )
    }

    return (
        <Box
            onClick={onClick}
            sx={{
                position: 'relative',
                flexShrink: 0,
                cursor: 'zoom-in',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(79,195,247,0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 0 16px rgba(79,195,247,0.35)',
                },
            }}
        >
            <Box
                component="img"
                src={src}
                alt={alt}
                onError={() => setBroken(true)}
                sx={{
                    width: 220,
                    height: 140,
                    display: 'block',
                    objectFit: 'cover',
                }}
            />
            <Box
                className="expand-icon"
                sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    bgcolor: 'rgba(4,11,24,0.65)',
                    borderRadius: '4px',
                    p: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <OpenInFullIcon sx={{ fontSize: 14, color: '#4fc3f7' }} />
            </Box>
        </Box>
    )
}

/* ─── Room info dialog ─── */
function RoomDialog({ room, onClose }) {
    const [lightboxIdx, setLightboxIdx] = useState(null)
    const { t } = useTranslation()
    if (!room) return null

    const roomName = t(`stargate.rooms.${room.id}.name`, room.name)
    const roomShortDesc = t(`stargate.rooms.${room.id}.shortDesc`, room.shortDesc)
    const roomLongDesc = t(`stargate.rooms.${room.id}.longDesc`, room.longDesc)

    return (
        <Dialog
            open={Boolean(room)}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: '#050d1c',
                    border: '1px solid rgba(79,195,247,0.2)',
                    boxShadow: '0 0 80px rgba(79,195,247,0.08)',
                    color: '#b3e5fc',
                    borderRadius: '3px',
                    overflow: 'hidden',
                },
            }}
        >
            {/* TOP CLASSIFICATION BANNER */}
            <Box
                sx={{
                    bgcolor: 'rgba(233,69,96,0.18)',
                    borderBottom: '1px solid rgba(233,69,96,0.5)',
                    py: 0.6,
                    textAlign: 'center',
                }}
            >
                <Typography
                    sx={{
                        color: '#e94560',
                        fontSize: '0.6rem',
                        fontWeight: 900,
                        letterSpacing: '0.22em',
                        fontFamily: "'Courier New', monospace",
                    }}
                >
                    ◆ TOP SECRET // SCI // NOFORN ◆
                </Typography>
            </Box>

            {/* LETTERHEAD */}
            <Box sx={{ px: 3, pt: 2, pb: 1.5, borderBottom: '1px solid rgba(79,195,247,0.12)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                        <Typography sx={{ fontSize: '0.52rem', color: 'rgba(79,195,247,0.38)', letterSpacing: '0.18em', fontFamily: "'Courier New', monospace", mb: 0.25 }}>
                            DEPARTMENT OF HOMEWORLD SECURITY
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#4fc3f7', letterSpacing: '0.1em', fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
                            STARGATE COMMAND
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '0.52rem', color: 'rgba(79,195,247,0.35)', fontFamily: "'Courier New', monospace", letterSpacing: '0.06em' }}>
                                FILE: SGC-{room.id.replace(/-/g, '').toUpperCase()}
                            </Typography>
                            <Typography sx={{ fontSize: '0.52rem', color: 'rgba(79,195,247,0.35)', fontFamily: "'Courier New', monospace", letterSpacing: '0.06em' }}>
                                LVL {room.level} // CLEARANCE: TS/SCI
                            </Typography>
                        </Box>
                        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(179,229,252,0.35)', p: 0.25, mt: -0.25 }}>
                            <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ borderBottom: '1px solid rgba(79,195,247,0.2)', mb: 1.5 }} />

                {/* Subject line */}
                <Box>
                    <Typography sx={{ fontSize: '0.5rem', color: 'rgba(79,195,247,0.35)', letterSpacing: '0.18em', fontFamily: "'Courier New', monospace", mb: 0.5 }}>
                        RE: LOCATION DESIGNATION
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon sx={{ color: 'rgba(79,195,247,0.5)', fontSize: 14 }} />
                        <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#e0f7fa', letterSpacing: '0.1em', fontFamily: "'Courier New', monospace" }}>
                            {roomName.toUpperCase()}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* DOCUMENT BODY */}
            <DialogContent sx={{ pt: 2.5, px: 3 }}>
                {/* 1. Summary */}
                <Box sx={{ mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.5rem', color: 'rgba(79,195,247,0.35)', letterSpacing: '0.18em', fontFamily: "'Courier New', monospace", mb: 0.75 }}>
                        1. SUMMARY
                    </Typography>
                    <Box sx={{ borderLeft: '2px solid rgba(79,195,247,0.3)', pl: 1.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', color: '#4fc3f7', fontFamily: "'Courier New', monospace", lineHeight: 1.65 }}>
                            {roomShortDesc}
                        </Typography>
                    </Box>
                </Box>

                {/* 2. Location details */}
                <Box sx={{ mb: room.screenshots?.length ? 2.5 : 0 }}>
                    <Typography sx={{ fontSize: '0.5rem', color: 'rgba(79,195,247,0.35)', letterSpacing: '0.18em', fontFamily: "'Courier New', monospace", mb: 0.75 }}>
                        2. LOCATION DETAILS
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: 'rgba(179,229,252,0.75)', fontFamily: "'Courier New', monospace", lineHeight: 1.8 }}>
                        {roomLongDesc}
                    </Typography>
                </Box>

                {/* 3. Reference imagery */}
                {room.screenshots?.length > 0 && (
                    <Box sx={{ borderTop: '1px dashed rgba(79,195,247,0.15)', pt: 2 }}>
                        <Typography sx={{ fontSize: '0.5rem', color: 'rgba(79,195,247,0.35)', letterSpacing: '0.18em', fontFamily: "'Courier New', monospace", mb: 1.5 }}>
                            3. {t('stargate.reference_footage', 'REFERENCE FOOTAGE')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                overflowX: 'auto',
                                pb: 1,
                                '&::-webkit-scrollbar': { height: 4 },
                                '&::-webkit-scrollbar-track': { background: 'transparent' },
                                '&::-webkit-scrollbar-thumb': { background: 'rgba(79,195,247,0.3)', borderRadius: 2 },
                            }}
                        >
                            {room.screenshots.map((src, i) => (
                                <Screenshot key={src} src={src} alt={`${room.name} screenshot`} onClick={() => setLightboxIdx(i)} />
                            ))}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            {/* BOTTOM CLASSIFICATION FOOTER */}
            <Box
                sx={{
                    borderTop: '1px solid rgba(233,69,96,0.3)',
                    bgcolor: 'rgba(233,69,96,0.06)',
                    px: 3,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography sx={{ flex: 1, fontSize: '0.5rem', color: 'rgba(233,69,96,0.5)', letterSpacing: '0.14em', fontFamily: "'Courier New', monospace" }}>
                    TOP SECRET // HANDLE VIA SCI CHANNELS ONLY
                </Typography>
                <Button
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: '#4fc3f7',
                        borderColor: 'rgba(79,195,247,0.35)',
                        border: '1px solid',
                        borderRadius: '3px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        px: 2,
                        fontFamily: "'Courier New', monospace",
                        '&:hover': { bgcolor: 'rgba(79,195,247,0.1)' },
                    }}
                >
                    {t('stargate.close', 'CLOSE FILE')}
                </Button>
            </Box>

            {lightboxIdx !== null && (
                <Lightbox
                    screenshots={room.screenshots}
                    index={lightboxIdx}
                    onClose={() => setLightboxIdx(null)}
                />
            )}
        </Dialog>
    )
}

/* ─── Colour helpers for the directory ─── */
const DOOR_SWATCH = {
    Red: '#e94560',
    Yellow: '#f5c518',
    White: '#e0f7fa',
    Turquoise: '#00bcd4',
    'Dark Blue': '#1565c0',
    'Medium Blue': '#1e88e5',
    'Light Blue': '#64b5f6',
}
const TUNNEL_SWATCH = {
    White: '#e0f7fa',
    Red: '#e94560',
    Yellow: '#f5c518',
    Amber: '#ffb300',
    'Pale Green': '#a5d6a7',
    'Pale Blue': '#90caf9',
    Blue: '#42a5f5',
    Green: '#66bb6a',
}
const TIER_BORDER = {
    interface: 'rgba(233,69,96,0.35)',
    support: 'rgba(245,197,24,0.35)',
    sgc: 'rgba(79,195,247,0.35)',
    'sgc-hl': 'rgba(255,255,255,0.45)',
}

/* ─── Facility Directory ─── */
function FacilityDirectory() {
    const [open, setOpen] = useState(false)

    // Group levels by tier, preserving order
    const tiers = ['interface', 'support', 'sgc', 'sgc-hl']

    return (
        <Box sx={{ mt: 5 }}>
            {/* Section header — click to expand */}
            <Box
                onClick={() => setOpen(o => !o)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    border: '1px solid rgba(79,195,247,0.25)',
                    borderBottom: open ? '1px solid rgba(79,195,247,0.1)' : '1px solid rgba(79,195,247,0.25)',
                    borderRadius: open ? '4px 4px 0 0' : '4px',
                    py: 1.75,
                    px: 2.5,
                    userSelect: 'none',
                    bgcolor: 'rgba(79,195,247,0.04)',
                    transition: 'background 0.15s',
                    '&:hover': { bgcolor: 'rgba(79,195,247,0.08)' },
                    '&:hover .dir-title': { color: '#4fc3f7' },
                    '&:hover .dir-chevron': { color: '#4fc3f7' },
                }}
            >
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(79,195,247,0.5)', fontFamily: "'Courier New', monospace", flexShrink: 0 }}>
                    ⊞
                </Typography>
                <Typography
                    className="dir-title"
                    sx={{
                        flex: 1,
                        fontSize: '0.65rem',
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: '0.18em',
                        color: 'rgba(179,229,252,0.75)',
                        fontWeight: 700,
                        transition: 'color 0.15s',
                    }}
                >
                    FACILITY SUBLEVEL DIRECTORY
                </Typography>
                <Typography sx={{ fontSize: '0.55rem', color: 'rgba(179,229,252,0.35)', fontFamily: "'Courier New', monospace", letterSpacing: '0.08em', mr: 1.5 }}>
                    CHEYENNE MOUNTAIN — 28 SUBLEVELS
                </Typography>
                <Typography className="dir-chevron" sx={{ fontSize: '0.65rem', color: 'rgba(79,195,247,0.5)', fontFamily: "'Courier New', monospace", letterSpacing: '0.1em', transition: 'color 0.15s' }}>
                    {open ? '▲' : '▼'}
                </Typography>
            </Box>

            {open && (
                <Box
                    sx={{
                        border: '1px solid rgba(79,195,247,0.25)',
                        borderTop: 'none',
                        borderRadius: '0 0 4px 4px',
                        overflow: 'hidden',
                        bgcolor: '#030913',
                    }}
                >
                    {/* Column headers */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '56px 1fr 110px 110px',
                            gap: 0,
                            bgcolor: 'rgba(79,195,247,0.07)',
                            borderBottom: '1px solid rgba(79,195,247,0.2)',
                            px: 2.5,
                            py: 1,
                        }}
                    >
                        {['LVL', 'FUNCTION / DESIGNATION', 'DOOR COLOR', 'TUNNEL LIGHTS'].map(h => (
                            <Typography key={h} sx={{ fontSize: '0.55rem', color: 'rgba(79,195,247,0.6)', fontFamily: "'Courier New', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>
                                {h}
                            </Typography>
                        ))}
                    </Box>

                    {tiers.map(tier => {
                        const rows = facilityLevels.filter(l => l.tier === tier)
                        const meta = tierMeta[tier]
                        return (
                            <Box key={tier}>
                                {/* Tier header */}
                                <Box
                                    sx={{
                                        borderLeft: `3px solid ${TIER_BORDER[tier]}`,
                                        borderTop: '1px solid rgba(79,195,247,0.1)',
                                        px: 2.5,
                                        py: 1,
                                        bgcolor: 'rgba(79,195,247,0.04)',
                                    }}
                                >
                                    <Typography sx={{ fontSize: '0.6rem', color: 'rgba(179,229,252,0.8)', fontFamily: "'Courier New', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>
                                        {meta.label}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.52rem', color: 'rgba(179,229,252,0.4)', fontFamily: "'Courier New', monospace", letterSpacing: '0.08em', mt: 0.25 }}>
                                        {meta.clearance}
                                    </Typography>
                                </Box>

                                {/* Level rows */}
                                {rows.map((row, i) => (
                                    <Box
                                        key={row.level}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '56px 1fr 110px 110px',
                                            gap: 0,
                                            px: 2.5,
                                            py: 0.85,
                                            borderTop: '1px solid rgba(79,195,247,0.06)',
                                            borderLeft: `3px solid ${TIER_BORDER[tier]}`,
                                            bgcolor: row.level === 27 || row.level === 28
                                                ? 'rgba(79,195,247,0.07)'
                                                : i % 2 === 0 ? 'transparent' : 'rgba(79,195,247,0.025)',
                                        }}
                                    >
                                        {/* Level number */}
                                        <Typography sx={{
                                            fontSize: '0.82rem',
                                            color: row.level >= 26 ? '#e0f7fa' : 'rgba(179,229,252,0.6)',
                                            fontFamily: "'Courier New', monospace",
                                            fontWeight: row.level >= 26 ? 700 : 400,
                                        }}>
                                            {String(row.level).padStart(2, '0')}
                                        </Typography>

                                        {/* Function */}
                                        <Typography sx={{
                                            fontSize: '0.75rem',
                                            color: row.function ? 'rgba(179,229,252,0.8)' : 'rgba(179,229,252,0.25)',
                                            fontFamily: "'Courier New', monospace",
                                            fontStyle: row.function ? 'normal' : 'italic',
                                            pr: 2,
                                            lineHeight: 1.5,
                                        }}>
                                            {row.function ?? '[REDACTED]'}
                                        </Typography>

                                        {/* Door swatch */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {row.doorColor ? (
                                                <>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: DOOR_SWATCH[row.doorColor] ?? '#888', flexShrink: 0 }} />
                                                    <Typography sx={{ fontSize: '0.68rem', color: 'rgba(179,229,252,0.6)', fontFamily: "'Courier New', monospace" }}>
                                                        {row.doorColor}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.68rem', color: 'rgba(179,229,252,0.2)', fontFamily: "'Courier New', monospace" }}>—</Typography>
                                            )}
                                        </Box>

                                        {/* Tunnel swatch */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {row.tunnelLights ? (
                                                <>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: TUNNEL_SWATCH[row.tunnelLights] ?? '#888', flexShrink: 0, boxShadow: `0 0 5px ${TUNNEL_SWATCH[row.tunnelLights] ?? '#888'}` }} />
                                                    <Typography sx={{ fontSize: '0.68rem', color: 'rgba(179,229,252,0.6)', fontFamily: "'Courier New', monospace" }}>
                                                        {row.tunnelLights}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.68rem', color: 'rgba(179,229,252,0.2)', fontFamily: "'Courier New', monospace" }}>—</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )
                    })}

                    {/* Footer note */}
                    <Box sx={{ px: 2.5, py: 1.25, borderTop: '1px solid rgba(79,195,247,0.12)', bgcolor: 'rgba(233,69,96,0.05)' }}>
                        <Typography sx={{ fontSize: '0.52rem', color: 'rgba(233,69,96,0.5)', fontFamily: "'Courier New', monospace", letterSpacing: '0.1em' }}>
                            DISSEMINATION RESTRICTED — HANDLE VIA SCI CHANNELS ONLY — DO NOT REPRODUCE WITHOUT WRITTEN AUTHORISATION FROM THE DEPARTMENT OF HOMEWORLD SECURITY
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

/* ─── Page ─── */
export default function StargatePage() {
    const [selectedRoomId, setSelectedRoomId] = useState(null)
    const selectedRoom = selectedRoomId ? getRoomById(selectedRoomId) : null

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#040b18',
                color: '#b3e5fc',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Top bar */}
            <Box
                sx={{
                    borderBottom: '1px solid rgba(79,195,247,0.15)',
                    px: { xs: 2, md: 5 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'rgba(6,15,30,0.95)',
                    backdropFilter: 'blur(8px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                {/* SGC emblem — animated stargate */}
                <Box sx={{ flexShrink: 0, lineHeight: 0 }}>
                    <AnimatedStargate size={42} rpm={0.6} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            color: '#e0f7fa',
                            letterSpacing: '0.12em',
                            fontSize: { xs: '0.8rem', md: '1rem' },
                            lineHeight: 1.2,
                        }}
                    >
                        STARGATE COMMAND
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: 'rgba(79,195,247,0.5)', letterSpacing: '0.1em', fontSize: '0.65rem' }}
                    >
                        CHEYENNE MOUNTAIN COMPLEX — INTERACTIVE FACILITY MAP
                    </Typography>
                </Box>

                <Chip
                    label="TOP SECRET"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(233,69,96,0.12)',
                        color: '#e94560',
                        border: '1px solid rgba(233,69,96,0.4)',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        letterSpacing: '0.08em',
                    }}
                />
                <LanguageSwitcher />
            </Box>

            {/* Main content */}
            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2, sm: 4, md: 8 },
                    py: { xs: 3, md: 5 },
                    maxWidth: 1100,
                    width: '100%',
                    mx: 'auto',
                }}
            >
                {/* Decorative gate + intro */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    {/* Animated gate */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <AnimatedStargate size={220} rpm={0.75} dialing />
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            color: '#e0f7fa',
                            letterSpacing: '0.06em',
                            fontSize: { xs: '1.3rem', md: '1.8rem' },
                            mb: 0.75,
                        }}
                    >
                        CHEYENNE MOUNTAIN COMPLEX
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(179,229,252,0.5)', letterSpacing: '0.05em', fontSize: '0.82rem' }}
                    >
                        Colorado Springs, CO — 28 sublevels — Stargate on Sublevel 28
                    </Typography>
                </Box>

                {/* Floor plan */}
                <FloorPlan selectedRoom={selectedRoomId} onRoomSelect={setSelectedRoomId} />

                {/* Facility Directory */}
                <FacilityDirectory />
            </Box>

            {/* Footer bar */}
            <Box
                sx={{
                    borderTop: '1px solid rgba(79,195,247,0.1)',
                    px: 4,
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
                {['NORAD', 'U.S. AIR FORCE', 'CLASSIFIED LEVEL 28'].map((label) => (
                    <Typography
                        key={label}
                        variant="caption"
                        sx={{ color: 'rgba(79,195,247,0.25)', letterSpacing: '0.1em', fontSize: '0.62rem' }}
                    >
                        {label}
                    </Typography>
                ))}
            </Box>

            {/* Room detail dialog */}
            <RoomDialog room={selectedRoom} onClose={() => setSelectedRoomId(null)} />
        </Box>
    )
}
