import { useState } from 'react'
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
    useScrollTrigger,
    Slide,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { personalInfo } from '../data/cvData'
import LanguageSwitcher from './LanguageSwitcher'

// Nav items are now derived from translations inside the component

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
                        bgcolor: 'rgba(255,255,255,0.85)',
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
