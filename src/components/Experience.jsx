import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Card, CardContent, Chip, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

export default function Experience() {
    const { t } = useTranslation()
    const items = t('experience.items', { returnObjects: true })

    return (
        <Box id="experience" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 8, textAlign: 'center' }}>
                    {t('experience.title')}
                </Typography>

                <Box sx={{ position: 'relative', pl: { xs: 0, md: 5 } }}>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'absolute',
                            left: 18,
                            top: 0,
                            bottom: 0,
                            width: 2,
                            bgcolor: 'divider',
                        }}
                    />

                    <Stack spacing={4}>
                        {items.map((item, index) => (
                            <Box key={index} sx={{ position: 'relative' }}>
                                {/* Timeline dot */}
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        position: 'absolute',
                                        left: -47,
                                        top: 20,
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        zIndex: 1,
                                    }}
                                >
                                    <WorkIcon sx={{ fontSize: 18 }} />
                                </Box>

                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', transition: 'box-shadow .2s', '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                        {/* Header row */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                                            <Box>
                                                <Typography variant="h6" color="primary.main">{item.role}</Typography>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    {item.company} · {item.location}
                                                </Typography>
                                            </Box>
                                            <Chip label={item.period} size="small" variant="outlined" />
                                        </Box>

                                        {/* Bullets */}
                                        <List dense disablePadding>
                                            {item.bullets.map((bullet, i) => (
                                                <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start' }}>
                                                    <ListItemIcon sx={{ minWidth: 20, mt: 0.6 }}>
                                                        <FiberManualRecordIcon sx={{ fontSize: 8, color: 'secondary.main' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={bullet}
                                                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        {/* Tags */}
                                        <Stack direction="row" flexWrap="wrap" gap={0.75} mt={2}>
                                            {item.tags.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{ bgcolor: 'primary.main', color: 'white', fontSize: '0.7rem' }}
                                                />
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
