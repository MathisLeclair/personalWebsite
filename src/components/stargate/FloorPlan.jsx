import { useState } from 'react'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import Level27Plan from './Level27Plan'
import Level28Plan from './Level28Plan'
import { STARGATE_ADDRESSES } from '../../data/stargateAddresses'

function GlyphBadge({ n }) {
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '1px solid rgba(79,195,247,0.35)',
                bgcolor: 'rgba(79,195,247,0.08)',
                fontSize: '0.6rem',
                fontFamily: "'Courier New', monospace",
                color: '#4fc3f7',
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
            }}
        >
            {n}
        </Box>
    )
}

export default function FloorPlan({ selectedRoom, onRoomSelect }) {
    const [level, setLevel] = useState(28)

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
                        gridTemplateColumns: '1fr 160px auto',
                        px: 1.5,
                        py: 0.75,
                        bgcolor: 'rgba(79,195,247,0.05)',
                        borderRadius: '3px 3px 0 0',
                        border: '1px solid rgba(79,195,247,0.12)',
                        borderBottom: 'none',
                    }}>
                        {['DESIGNATION', 'EPISODE REF', 'ADDRESS GLYPHS'].map(h => (
                            <Typography key={h} sx={{
                                fontSize: '0.5rem',
                                fontFamily: "'Courier New', monospace",
                                letterSpacing: '0.16em',
                                color: 'rgba(79,195,247,0.55)',
                                fontWeight: 700,
                            }}>{h}</Typography>
                        ))}
                    </Box>

                    {/* Address rows */}
                    <Box sx={{
                        border: '1px solid rgba(79,195,247,0.12)',
                        borderRadius: '0 0 3px 3px',
                        overflow: 'hidden',
                    }}>
                        {STARGATE_ADDRESSES.map((addr, i) => (
                            <Box
                                key={addr.name}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 160px auto',
                                    alignItems: 'center',
                                    px: 1.5,
                                    py: 0.9,
                                    borderTop: i === 0 ? 'none' : '1px solid rgba(79,195,247,0.07)',
                                    bgcolor: i % 2 === 0 ? 'transparent' : 'rgba(79,195,247,0.025)',
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.72rem',
                                    fontFamily: "'Courier New', monospace",
                                    color: '#b3e5fc',
                                    fontWeight: 600,
                                    letterSpacing: '0.06em',
                                }}>
                                    {addr.name}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.62rem',
                                    fontFamily: "'Courier New', monospace",
                                    color: 'rgba(179,229,252,0.4)',
                                    letterSpacing: '0.04em',
                                    fontStyle: 'italic',
                                    pr: 1,
                                }}>
                                    {addr.episode}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {addr.glyphs.map((g, gi) => (
                                        <GlyphBadge key={gi} n={g} />
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ mt: 1.5, textAlign: 'right' }}>
                        <Typography sx={{
                            fontSize: '0.5rem',
                            fontFamily: "'Courier New', monospace",
                            color: 'rgba(233,69,96,0.45)',
                            letterSpacing: '0.1em',
                        }}>
                            {STARGATE_ADDRESSES.length} VERIFIED ADDRESSES — CLASSIFIED // HANDLE VIA SCI CHANNELS
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )
}
