import { useState } from 'react'
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
import FloorPlan from '../components/stargate/FloorPlan'
import { getRoomById } from '../data/stargateRooms'

/* ─── Screenshot with graceful fallback ─── */
function Screenshot({ src, alt }) {
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
            component="img"
            src={src}
            alt={alt}
            onError={() => setBroken(true)}
            sx={{
                width: 220,
                height: 140,
                flexShrink: 0,
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid rgba(79,195,247,0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 0 16px rgba(79,195,247,0.35)',
                },
            }}
        />
    )
}

/* ─── Room info dialog ─── */
function RoomDialog({ room, onClose }) {
    if (!room) return null

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
                    {room.name}
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
                    {room.shortDesc}
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
                    {room.longDesc}
                </Typography>

                {/* Screenshots */}
                {room.screenshots?.length > 0 && (
                    <>
                        <Divider sx={{ borderColor: 'rgba(79,195,247,0.1)', mb: 2 }} />
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(79,195,247,0.5)', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}
                        >
                            REFERENCE FOOTAGE
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
                            {room.screenshots.map((src) => (
                                <Screenshot key={src} src={src} alt={`${room.name} screenshot`} />
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
                    CLOSE FILE
                </Button>
            </DialogActions>
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
