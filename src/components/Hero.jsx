import { useTranslation } from 'react-i18next'
import { Box, Typography, Button, Stack, Container, Avatar, IconButton } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import DownloadIcon from '@mui/icons-material/Download'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { personalInfo } from '../data/cvData'

export default function Hero() {
    const { t, i18n } = useTranslation()
    const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
    const cvUrl = lang === 'fr' ? personalInfo.cvFr : personalInfo.cvEn

    const handleContact = () => {
        window.open(`https://mail.google.com/mail/?view=cm&to=${personalInfo.email}`, '_blank')
    }

    return (
        <Box
            id="hero"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack spacing={2.5} alignItems="center" textAlign="center">
                    {/* Circular profile photo */}
                    <Avatar
                        src={personalInfo.avatarUrl}
                        alt={personalInfo.name}
                        sx={{
                            width: { xs: 140, md: 180 },
                            height: { xs: 140, md: 180 },
                            border: '4px solid',
                            borderColor: 'divider',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            mb: 1,
                        }}
                    />

                    <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 600, letterSpacing: 2 }}>
                        {t('hero.greeting')}
                    </Typography>

                    <Typography
                        variant="h1"
                        sx={{ fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1, color: 'primary.main' }}
                    >
                        {personalInfo.name}
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                    >
                        {t('hero.title')}
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520, pt: 1 }}>
                        {t('hero.tagline')}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<EmailIcon />}
                            onClick={handleContact}
                            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#c73652' } }}
                        >
                            {t('hero.cta_contact')}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<DownloadIcon />}
                            component="a"
                            href={cvUrl}
                            download
                            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                        >
                            {t('hero.cta_resume')}
                        </Button>
                    </Stack>
                </Stack>
            </Container>

            {/* Scroll-down arrow */}
            <IconButton
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Scroll down"
                sx={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'text.secondary',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    p: 0.5,
                    animation: 'bounce 2s infinite',
                    '@keyframes bounce': {
                        '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
                        '50%': { transform: 'translateX(-50%) translateY(8px)' },
                    },
                }}
            >
                <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
        </Box>
    )
}
