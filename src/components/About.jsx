import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Chip, Stack } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkIcon from '@mui/icons-material/Work'

export default function About() {
    const { t } = useTranslation()

    return (
        <Box id="about" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 4, textAlign: 'center' }}>
                    {t('about.title')}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ fontSize: '1.05rem', lineHeight: 1.9, color: 'text.secondary', mb: 3, textAlign: 'center' }}
                >
                    {t('about.description')}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1} justifyContent="center">
                    <Chip icon={<LocationOnIcon />} label={t('about.location')} variant="outlined" />
                    <Chip icon={<WorkIcon />} label={t('about.available')} color="secondary" />
                </Stack>
            </Container>
        </Box>
    )
}
