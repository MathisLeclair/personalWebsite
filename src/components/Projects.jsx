import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, Stack } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { projects } from '../data/cvData'

export default function Projects() {
    const { t } = useTranslation()
    const i18nItems = t('projects.items', { returnObjects: true })
    // Merge stable metadata from cvData with translated descriptions from locale files
    const items = projects.map((p, i) => ({ ...p, description: i18nItems[i]?.description ?? '' }))

    return (
        <Box id="projects" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 8, textAlign: 'center' }}>
                    {t('projects.title')}
                </Typography>

                <Grid container spacing={3}>
                    {items.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'transform .2s, box-shadow .2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography variant="h6" gutterBottom color="primary.main">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {item.description}
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={0.75}>
                                        {item.tags.map((tag) => (
                                            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                        ))}
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{ px: 3, pb: 2, gap: 1 }}>
                                    {item.github && (
                                        <Button
                                            size="small"
                                            startIcon={<GitHubIcon />}
                                            href={item.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('projects.view_code')}
                                        </Button>
                                    )}
                                    {item.demo && (
                                        <Button
                                            size="small"
                                            startIcon={<OpenInNewIcon />}
                                            href={item.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="secondary"
                                        >
                                            {t('projects.view_demo')}
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}
