import { useState, useRef, useCallback } from 'react'
import { Box, Tabs, Tab, Typography, Tooltip, IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import Level27Plan from './Level27Plan'
import Level28Plan from './Level28Plan'
import AnimatedStargate from './AnimatedStargate'
import { STARGATE_ADDRESSES } from '../../data/stargateAddresses'

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

    // Gate tab state
    const [dialingAddrName, setDialingAddrName] = useState('')
    const [dialKey, setDialKey] = useState(0)
    const forcedAddrRef = useRef(null)

    const handleDialAddress = useCallback((addr) => {
        forcedAddrRef.current = addr
        setDialKey(k => k + 1)
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

                                    {/* Glyphs + copy */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {addr.glyphs.map((g, gi) => (
                                            <GlyphBadge key={gi} n={g} />
                                        ))}
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
                            CLICK ANY ROW TO DIAL THAT ADDRESS
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
        </Box>
    )
}
