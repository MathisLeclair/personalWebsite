import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    IconButton,
    Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import FloorPlan from '../components/stargate/FloorPlan'
import { getRoomById } from '../data/stargateRooms'
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
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    background: '#080f20',
                    border: '1px solid rgba(79,195,247,0.25)',
                    boxShadow: '0 0 60px rgba(79,195,247,0.12)',
                    color: '#b3e5fc',
                    borderRadius: '10px',
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 1,
                    borderBottom: '1px solid rgba(79,195,247,0.15)',
                }}
            >
                <LockIcon sx={{ color: '#4fc3f7', fontSize: 18 }} />
                <Typography
                    variant="h6"
                    component="span"
                    sx={{ fontWeight: 700, color: '#e0f7fa', fontFamily: "'Inter',sans-serif", flex: 1, fontSize: '1rem' }}
                >
                    {roomName}
                </Typography>
                <Chip
                    label={`LEVEL ${room.level}`}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(79,195,247,0.12)',
                        color: '#4fc3f7',
                        border: '1px solid rgba(79,195,247,0.35)',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        letterSpacing: '0.07em',
                        height: 22,
                    }}
                />
                <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(179,229,252,0.5)', ml: 0.5 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* Body */}
            <DialogContent sx={{ pt: 2.5 }}>
                {/* Short desc */}
                <Typography
                    variant="body2"
                    sx={{
                        color: '#4fc3f7',
                        fontStyle: 'italic',
                        mb: 1.5,
                        fontSize: '0.85rem',
                        letterSpacing: '0.03em',
                    }}
                >
                    {roomShortDesc}
                </Typography>

                {/* Long desc */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(179,229,252,0.85)',
                        lineHeight: 1.75,
                        fontSize: '0.88rem',
                        mb: room.screenshots?.length ? 2.5 : 0,
                    }}
                >
                    {roomLongDesc}
                </Typography>

                {/* Screenshots */}
                {room.screenshots?.length > 0 && (
                    <>
                        <Divider sx={{ borderColor: 'rgba(79,195,247,0.1)', mb: 2 }} />
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(79,195,247,0.5)', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}
                        >
                            {t('stargate.reference_footage', 'REFERENCE FOOTAGE')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                overflowX: 'auto',
                                pb: 1,
                                '&::-webkit-scrollbar': { height: 4 },
                                '&::-webkit-scrollbar-track': { background: 'transparent' },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'rgba(79,195,247,0.3)',
                                    borderRadius: 2,
                                },
                            }}
                        >
                            {room.screenshots.map((src, i) => (
                                <Screenshot key={src} src={src} alt={`${room.name} screenshot`} onClick={() => setLightboxIdx(i)} />
                            ))}
                        </Box>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ borderTop: '1px solid rgba(79,195,247,0.1)', px: 3, py: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(79,195,247,0.3)', flex: 1, letterSpacing: '0.05em' }}>
                    STARGATE COMMAND — CLASSIFIED
                </Typography>
                <Button
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: '#4fc3f7',
                        borderColor: 'rgba(79,195,247,0.35)',
                        border: '1px solid',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        px: 2,
                        '&:hover': { bgcolor: 'rgba(79,195,247,0.1)' },
                    }}
                >
                    {t('stargate.close', 'CLOSE FILE')}
                </Button>
            </DialogActions>

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
                {/* SGC emblem placeholder */}
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        border: '2px solid rgba(79,195,247,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                    }}
                >
                    ✦
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
                {/* Intro */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
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
