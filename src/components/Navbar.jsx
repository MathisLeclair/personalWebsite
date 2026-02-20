import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Tooltip,
    useScrollTrigger,
    Slide,
    useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { personalInfo } from '../data/cvData'
import LanguageSwitcher from './LanguageSwitcher'
import { ColorModeContext } from '../App'

function HideOnScroll({ children }) {
    const trigger = useScrollTrigger()
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { t } = useTranslation()
    const { mode, toggleColorMode } = useContext(ColorModeContext)
    const theme = useTheme()

    const NAV_ITEMS = [
        { label: t('nav.about'), href: '#about' },
        { label: t('nav.experience'), href: '#experience' },
        { label: t('nav.skills'), href: '#skills' },
        { label: t('nav.education'), href: '#education' },
        { label: t('nav.projects'), href: '#projects' },
        { label: t('nav.contact'), href: '#contact' },
    ]

    const handleNavClick = (href) => {
        setDrawerOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            <HideOnScroll>
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        bgcolor: theme.palette.mode === 'light'
                            ? 'rgba(255,255,255,0.85)'
                            : 'rgba(13,13,26,0.85)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
                        {/* Logo / name */}
                        <Typography
                            variant="h6"
                            component="a"
                            href="#hero"
                            onClick={() => handleNavClick('#hero')}
                            sx={{
                                flexGrow: 1,
                                color: 'primary.main',
                                textDecoration: 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            {personalInfo.name}
                        </Typography>

                        {/* Desktop links */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                            {NAV_ITEMS.map((item) => (
                                <Button
                                    key={item.label}
                                    color="inherit"
                                    onClick={() => handleNavClick(item.href)}
                                    sx={{ color: 'text.primary', '&:hover': { color: 'secondary.main' } }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Language switcher (always visible) */}
                        <LanguageSwitcher />

                        {/* Dark mode toggle */}
                        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
                            <IconButton onClick={toggleColorMode} sx={{ ml: 0.5, color: 'text.primary' }}>
                                {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        {/* Mobile burger */}
                        <IconButton
                            sx={{ display: { xs: 'flex', md: 'none' }, color: 'primary.main', ml: 1 }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>

            {/* Mobile drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 240, pt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 1 }}>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {NAV_ITEMS.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton onClick={() => handleNavClick(item.href)}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}
