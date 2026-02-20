import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Grid, Paper, Chip, Stack } from '@mui/material'
import { skills } from '../data/cvData'

const CATEGORY_COLORS = {
    frontend: '#e94560',
    backend: '#0f3460',
    database_cloud: '#16213e',
    tools: '#533483',
    ai: '#00695c',
}

export default function Skills() {
    const { t } = useTranslation()

    return (
        <Box id="skills" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 8, textAlign: 'center' }}>
                    {t('skills.title')}
                </Typography>

                <Grid container spacing={3}>
                    {Object.entries(skills).map(([key, tags]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderTop: '3px solid',
                                    borderTopColor: CATEGORY_COLORS[key],
                                    transition: 'box-shadow .2s',
                                    '&:hover': { boxShadow: 4 },
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, color: CATEGORY_COLORS[key] }}>
                                    {t(`skills.categories.${key}`)}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {tags.map((skill) => (
                                        <Chip
                                            key={skill}
                                            label={skill}
                                            variant="outlined"
                                            sx={{ borderColor: CATEGORY_COLORS[key], color: CATEGORY_COLORS[key] }}
                                        />
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}
