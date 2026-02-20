import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Card, CardContent, Chip } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'

export default function Education() {
    const { t } = useTranslation()
    const items = t('education.items', { returnObjects: true })

    return (
        <Box id="education" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 8, textAlign: 'center' }}>
                    {t('education.title')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            elevation={0}
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'box-shadow .2s',
                                '&:hover': { boxShadow: 4 },
                            }}
                        >
                            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 2,
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        <SchoolIcon />
                                    </Box>
                                    <Chip label={item.period} size="small" variant="outlined" />
                                </Box>

                                <Typography variant="h6" gutterBottom>{item.degree}</Typography>
                                <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                                    {item.institution}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                                    {item.location}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    )
}
