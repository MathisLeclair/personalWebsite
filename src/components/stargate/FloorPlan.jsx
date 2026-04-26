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

const ORIGIN_GLYPH = 1
const RANDOM_CONNECT_CHANCE = 0.22

// Stargate planet name generator — mirrors the two canonical naming conventions:
// 1. P-code:   P<letter|digit><digit> - <three digits>   e.g. P3X-118, PB5-926
// 2. Alien/mythological compound names                   e.g. VAGON BREI, PRACLARUSH TAONAS
const SG_NAME_SYLLABLES = [
    'AB', 'AK', 'AL', 'AN', 'AR', 'AT', 'AX',
    'BAL', 'BEL', 'BOR', 'BRA',
    'CAL', 'CHA', 'CHU', 'COR',
    'DAR', 'DEL', 'DOR', 'DRA',
    'EL', 'EN', 'ER', 'EX',
    'FAR', 'FEN', 'FOR',
    'GAL', 'GOR',
    'HAK', 'HAL', 'HAN', 'HOR',
    'IL', 'IN', 'IR',
    'JAL', 'JAR', 'JOR', 'JUN',
    'KAL', 'KAN', 'KHA', 'KOR', 'KUL',
    'LAR', 'LEN', 'LON', 'LUR',
    'MAR', 'MEL', 'MOR', 'MUN',
    'NAK', 'NAR', 'NOR',
    'OL', 'OR', 'OX',
    'PAL', 'PAN', 'PAR', 'POL', 'PRA',
    'RAK', 'RAN', 'REL', 'ROR', 'RUN',
    'SAK', 'SAL', 'SAN', 'SOR', 'SUR',
    'TAK', 'TAL', 'TAO', 'TAR', 'TEL', 'TOR', 'TUL',
    'UL', 'UR', 'UX',
    'VAG', 'VAL', 'VAN', 'VOR',
    'WAR', 'WOR',
    'XAN', 'XOR',
    'YAL', 'YOR',
    'ZAK', 'ZAL', 'ZOR',
]
const SG_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const SG_DIGITS = '0123456789'

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pickChar(str) { return str[Math.floor(Math.random() * str.length)] }

function generateStargateName() {
    if (Math.random() < 0.85) {
        // P-code style: P<alpha><digit>-<3 digits>  e.g. P3X-118
        const prefix = 'P'
        const mid = Math.random() < 0.6
            ? pickChar(SG_DIGITS) + pickChar(SG_ALPHA)   // digit+letter: P3X
            : pickChar(SG_ALPHA) + pickChar(SG_DIGITS)   // letter+digit: PB5
        const suffix = String(Math.floor(Math.random() * 900) + 100)  // 100-999
        return `${prefix}${mid}-${suffix}`
    }
    // Alien name: 1-3 syllable words, 1-2 words total
    const wordCount = Math.random() < 0.55 ? 1 : 2
    const words = Array.from({ length: wordCount }, () => {
        const sylCount = Math.random() < 0.4 ? 1 : Math.random() < 0.7 ? 2 : 3
        return Array.from({ length: sylCount }, () => pick(SG_NAME_SYLLABLES)).join('')
    })
    return words.join(' ')
}


const ADDRESS_LORE = {
    ABYDOS: {
        key: 'abydos',
        worldType: 'Desert world in the Milky Way',
        faction: 'Abydonians; formerly under Ra',
        status: 'Destroyed in 2003 (SG-1 canon)',
        firstSeen: 'Stargate (1994 film)',
        canonNotes: [
            'First world reached by modern Tau\'ri gate travel.',
            'A cartouche on Abydos provided a major list of Stargate addresses used by early SG-1 operations.',
            'Destroyed by Anubis in "Full Circle".',
        ],
        sources: [
            { label: 'Abydos (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Abydos' },
            { label: 'Children of the Gods', url: 'https://stargate.fandom.com/wiki/Children_of_the_Gods_(episode)' },
            { label: 'Full Circle', url: 'https://stargate.fandom.com/wiki/Full_Circle_(episode)' },
        ],
    },
    CHULAK: {
        key: 'chulak',
        worldType: 'Jaffa homeworld in the Milky Way',
        faction: 'Jaffa; historically Apophis, later Free Jaffa Nation',
        status: 'Under Free Jaffa control after Ori conflict',
        firstSeen: 'SG-1: "Children of the Gods"',
        canonNotes: [
            'Homeworld of Teal\'c and a central early-theatre world for SG-1.',
            'The Jaffa rebellion is tied to Chulak as one of the first worlds to reject Goa\'uld rule.',
            'Later occupied during the Ori campaign and subsequently liberated.',
        ],
        sources: [
            { label: 'Chulak (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Chulak' },
            { label: 'Children of the Gods', url: 'https://stargate.fandom.com/wiki/Children_of_the_Gods_(episode)' },
            { label: 'The Ark of Truth', url: 'https://stargate.fandom.com/wiki/The_Ark_of_Truth' },
        ],
    },
    TOLLAN: {
        key: 'tollan',
        worldType: 'Former Tollan homeworld (now uninhabitable)',
        faction: 'Tollan civilization (historical)',
        status: 'Abandoned after planetary environmental collapse',
        firstSeen: 'SG-1: "Enigma"',
        canonNotes: [
            'Original homeworld of the Tollan before large-scale evacuation.',
            'SG-1 encountered Tollan survivors during the planetary disaster.',
            'Population relocated to Tollana with Nox assistance.',
        ],
        sources: [
            { label: 'Tollan (planet) (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Tollan_(planet)' },
            { label: 'Enigma', url: 'https://stargate.fandom.com/wiki/Enigma_(episode)' },
        ],
    },
    TOLLANA: {
        key: 'tollana',
        worldType: 'Relocated Tollan colony world',
        faction: 'Tollan',
        status: 'Civilization devastated during Anubis-era conflict',
        firstSeen: 'SG-1: "Pretense"',
        canonNotes: [
            'Tollana was settled after Tollan was abandoned.',
            'The Tollan built strong ion-cannon defenses and maintained isolationist policies.',
            'Planet was attacked after Tanith/Anubis coercion events in "Between Two Fires".',
        ],
        sources: [
            { label: 'Tollana (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Tollana' },
            { label: 'Pretense', url: 'https://stargate.fandom.com/wiki/Pretense_(episode)' },
            { label: 'Between Two Fires', url: 'https://stargate.fandom.com/wiki/Between_Two_Fires_(episode)' },
        ],
    },
    KHEB: {
        key: 'kheb',
        worldType: 'Isolated world associated with ascension lore',
        faction: 'No standing polity; linked to Oma Desala in canon',
        status: 'Known as an off-limits sacred location in Jaffa lore',
        firstSeen: 'SG-1: "Maternal Instinct"',
        canonNotes: [
            'Kheb is identified as a retreat connected to Oma Desala and ascension teachings.',
            'Shifu was hidden there and later removed for protection.',
            'Referenced in later canon as relevant to Anubis\' ascent history.',
        ],
        sources: [
            { label: 'Kheb (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Kheb' },
            { label: 'Maternal Instinct', url: 'https://stargate.fandom.com/wiki/Maternal_Instinct_(episode)' },
            { label: 'Threads', url: 'https://stargate.fandom.com/wiki/Threads_(episode)' },
        ],
    },
    TARTARUS: {
        key: 'tartarus',
        worldType: 'Anubis-controlled military/production world',
        faction: 'Anubis (historical), later contested',
        status: 'Key Kull production site in SG-1 canon',
        firstSeen: 'SG-1: "Evolution, Part 2"',
        canonNotes: [
            'Anubis and Thoth used Tartarus for Kull-warrior development.',
            'The gate complex includes a forcefield functionally equivalent to an iris.',
            'SG-1 and allies conducted key operations there during Kull arc events.',
        ],
        sources: [
            { label: 'Tartarus (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Tartarus' },
            { label: 'Evolution, Part 2', url: 'https://stargate.fandom.com/wiki/Evolution,_Part_2_(episode)' },
            { label: 'Threads', url: 'https://stargate.fandom.com/wiki/Threads_(episode)' },
        ],
    },
    'PRACLARUSH TAONAS': {
        key: 'praclarush_taonas',
        worldType: 'Ancient world and Taonas outpost site',
        faction: 'Ancients (historical)',
        status: 'Ruined surface; significant Ancient remnants',
        firstSeen: 'SG-1: "Lost City, Part 2"',
        canonNotes: [
            'Praclarush Taonas is identified as one of the earliest Lantean worlds.',
            'Contains the Taonas outpost and a major Ancient star map reference to Atlantis.',
            'A ZPM recovered there enabled activation of Antarctic defenses in SG-1 continuity.',
        ],
        sources: [
            { label: 'Praclarush (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Praclarush' },
            { label: 'Lost City, Part 2', url: 'https://stargate.fandom.com/wiki/Lost_City,_Part_2_(episode)' },
            { label: 'The Pegasus Project', url: 'https://stargate.fandom.com/wiki/The_Pegasus_Project_(episode)' },
        ],
    },
    EURONDA: {
        key: 'euronda',
        worldType: 'Milky Way world depicted in active civil war',
        faction: 'Eurondans and Breeders',
        status: 'Eurondan bunker civilization collapses in episode continuity',
        firstSeen: 'SG-1: "The Other Side"',
        canonNotes: [
            'SG-1 initially receives a request for fuel support from Eurondan leadership.',
            'The conflict is revealed as an ideologically driven extermination campaign by Eurondans.',
            'SG-1 withdraws support and the Eurondan bunker is destroyed in the same episode arc.',
        ],
        sources: [
            { label: 'Euronda (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Euronda' },
            { label: 'The Other Side', url: 'https://stargate.fandom.com/wiki/The_Other_Side_(episode)' },
        ],
    },
    EDORA: {
        key: 'edora',
        worldType: 'Agrarian inhabited world in the Milky Way',
        faction: 'Edorans',
        status: 'Recurring meteor-cycle hazard world',
        firstSeen: 'SG-1: "A Hundred Days"',
        canonNotes: [
            'Edora experiences periodic "fire rain" from asteroid-belt interactions.',
            'A severe meteor cycle buried the local Stargate during SG-1 operations.',
            'The gate was later recovered in-episode continuity and Edora appears again in "Shades of Grey".',
        ],
        sources: [
            { label: 'Edora (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Edora' },
            { label: 'A Hundred Days', url: 'https://stargate.fandom.com/wiki/A_Hundred_Days_(episode)' },
            { label: 'Shades of Grey', url: 'https://stargate.fandom.com/wiki/Shades_of_Grey_(episode)' },
        ],
    },
    'EARTH (Beta Gate)': {
        key: 'earth_beta_gate',
        worldType: 'Secondary Earth Stargate installation',
        faction: 'Tau\'ri (SGC control in canon continuity)',
        status: 'Installed at SGC after Alpha Gate loss; later destroyed',
        firstSeen: 'SG-1: "Solitudes"',
        canonNotes: [
            'Earth\'s Beta Gate was found in Antarctica and identified as the Ancient-era Earth gate.',
            'Used as an operational replacement when the Alpha Gate was unavailable.',
            'Destroyed during the Redemption arc after Anubis-era gate-weapon events.',
        ],
        sources: [
            { label: 'Beta Gate (Stargate Wiki)', url: 'https://stargate.fandom.com/wiki/Beta_Gate' },
            { label: 'Solitudes', url: 'https://stargate.fandom.com/wiki/Solitudes_(episode)' },
            { label: 'Small Victories', url: 'https://stargate.fandom.com/wiki/Small_Victories_(episode)' },
            { label: 'Redemption, Part 2', url: 'https://stargate.fandom.com/wiki/Redemption,_Part_2_(episode)' },
        ],
    },
}

function getAddressLore(addr, t) {
    const lore = ADDRESS_LORE[addr.name]
    if (lore) {
        return {
            worldType: lore.worldType,
            faction: lore.faction,
            status: lore.status,
            firstSeen: lore.firstSeen,
            canonNotes: lore.canonNotes,
            sources: lore.sources,
        }
    }

    return {
        worldType: t('stargate.lore.fallback.worldType', 'Canonical profile not yet documented in-app'),
        faction: t('stargate.lore.fallback.faction', 'No sourced faction summary loaded'),
        status: t('stargate.lore.fallback.status', 'No canonical status loaded'),
        firstSeen: t('stargate.lore.fallback.firstSeen', 'No first-appearance source loaded'),
        canonNotes: [t('stargate.lore.fallback.note', {
            defaultValue: 'This destination is listed in {{episode}}, but expanded canon notes have not been added yet.',
            episode: addr.episode,
        })],
        sources: [],
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
    const [irisClosed, setIrisClosed] = useState(true)
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

    const lockOriginGlyph = useCallback(() => {
        setManualGlyphs(prev => {
            if (prev.length !== 6) return prev
            return [...prev, ORIGIN_GLYPH]
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
        if (manualGlyphs.length !== 7) return

        if (manualGlyphs[6] !== ORIGIN_GLYPH) {
            setManualResult({ ok: false, reason: 'origin' })
            return
        }

        const destinationGlyphs = manualGlyphs.slice(0, 6)
        const match = STARGATE_ADDRESSES.find(addr =>
            addr.glyphs.every((g, i) => g === destinationGlyphs[i])
        )
        if (match) {
            setManualResult({ ok: true, addr: match, random: false })
            return
        }

        if (Math.random() < RANDOM_CONNECT_CHANCE) {
            setManualResult({
                ok: true,
                random: true,
                addr: {
                    name: generateStargateName(),
                    episode: t('stargate.sim.noEpisodeReference', 'Uncharted — no SGC mission record'),
                    glyphs: destinationGlyphs,
                },
            })
            return
        }

        setManualResult({ ok: false, reason: 'noMatch' })
    }, [manualGlyphs, t])

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
                            irisClosed={irisClosed}
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
                        <Button
                            size="small"
                            onClick={() => setIrisClosed(v => !v)}
                            sx={{
                                color: irisClosed ? '#ffcdd2' : '#e0f7fa',
                                border: '1px solid rgba(79,195,247,0.28)',
                                bgcolor: irisClosed ? 'rgba(229,57,53,0.16)' : 'rgba(79,195,247,0.12)',
                            }}
                        >
                            {irisClosed
                                ? t('stargate.gateModes.irisClosed', 'IRIS: CLOSED')
                                : t('stargate.gateModes.irisOpen', 'IRIS: OPEN')}
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
                                {t('stargate.sim.instructions', 'Select 6 destination glyphs, lock the 7th (origin) symbol, then validate. Unknown sequences can still connect with a small probability if the origin lock is correct.')}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flexWrap: 'wrap', mb: 1.3 }}>
                                {Array.from({ length: 7 }, (_, i) => (
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
                                        {manualGlyphs[i]
                                            ? <GlyphBadge n={manualGlyphs[i]} />
                                            : <Typography sx={{ fontSize: '0.58rem', color: 'rgba(79,195,247,0.35)' }}>{i === 6 ? 'O' : i + 1}</Typography>}
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
                                    variant="outlined"
                                    onClick={lockOriginGlyph}
                                    disabled={manualGlyphs.length !== 6}
                                    sx={{ color: '#4fc3f7', borderColor: 'rgba(79,195,247,0.35)' }}
                                >
                                    {t('stargate.sim.lockOrigin', 'Lock Origin (7th Chevron)')}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={validateManualAddress}
                                    disabled={manualGlyphs.length !== 7}
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
                                            {manualResult.random ? (
                                                <Typography sx={{ color: '#a5d6a7', fontWeight: 700, mb: 0.5 }}>
                                                    {t('stargate.sim.randomConnect', 'Unscheduled lock achieved. Wormhole synchronization succeeded.')}
                                                </Typography>
                                            ) : (
                                                <Typography sx={{ color: '#a5d6a7', fontWeight: 700, mb: 0.5 }}>
                                                    {t('stargate.sim.match', { defaultValue: 'Valid destination: {{name}}', name: manualResult.addr.name })}
                                                </Typography>
                                            )}
                                            <Typography sx={{ color: 'rgba(179,229,252,0.75)', fontSize: '0.72rem', mb: 0.9 }}>
                                                {manualResult.random
                                                    ? t('stargate.sim.randomConnectHint', {
                                                        defaultValue: 'Random lock chance: {{chance}}% when 7th symbol is valid.',
                                                        chance: Math.round(RANDOM_CONNECT_CHANCE * 100),
                                                    })
                                                    : t('stargate.sim.matchEpisode', { defaultValue: 'Reference episode: {{episode}}', episode: manualResult.addr.episode })}
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
                                            {manualResult.reason === 'origin'
                                                ? t('stargate.sim.badOrigin', '7th symbol must be the origin chevron lock.')
                                                : t('stargate.sim.noMatch', 'No match in known address registry. Check glyph sequence and retry.')}
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
                            <LoreField label={t('stargate.lore.labels.risk', 'CANON STATUS')} value={activeLore.status} />
                            <LoreField label={t('stargate.lore.labels.firstSeen', 'FIRST APPEARANCE')} value={activeLore.firstSeen} />
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
                                {activeLore.canonNotes.map((line, idx) => (
                                    <Box key={idx} component="span" sx={{ display: 'block', mb: idx === activeLore.canonNotes.length - 1 ? 0 : 0.65 }}>
                                        {`- ${line}`}
                                    </Box>
                                ))}
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
                                {t('stargate.lore.labels.sources', 'CANON SOURCES')}
                            </Typography>
                            {activeLore.sources.length === 0 && (
                                <Typography sx={{ fontSize: '0.78rem', lineHeight: 1.55, color: 'rgba(179,229,252,0.68)' }}>
                                    {t('stargate.lore.noSources', 'No source links loaded for this entry yet.')}
                                </Typography>
                            )}
                            {activeLore.sources.map((src) => (
                                <Typography
                                    key={src.url}
                                    component="a"
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{
                                        display: 'block',
                                        fontSize: '0.74rem',
                                        lineHeight: 1.55,
                                        color: '#4fc3f7',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    {src.label}
                                </Typography>
                            ))}
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
