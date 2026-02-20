import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Link, Stack } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { personalInfo } from '../data/cvData'

export default function Footer() {
    const { t } = useTranslation()

    return (
        <Box
            component="footer"
            sx={{
                py: 4,
                bgcolor: 'primary.main',
                color: 'rgba(255,255,255,0.7)',
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    {/* Made with love */}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2">{t('footer.made_with')}</Typography>
                        <FavoriteIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                        <Typography variant="body2">{t('footer.and')} React + Material UI</Typography>
                    </Stack>

                    {/* Copyright */}
                    <Typography variant="body2">
                        © {new Date().getFullYear()}{' '}
                        <Link href="#hero" color="inherit" underline="hover">
                            {personalInfo.name}
                        </Link>
                        {' '}— {t('footer.rights')}
                    </Typography>
                </Stack>
            </Container>
        </Box>
    )
}
