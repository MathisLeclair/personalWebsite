import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Grid, Paper, Chip, Stack, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { skills, categoryColors, darkCategoryColors, skillCertificates } from '../data/cvData'

export default function Skills() {
    const { t } = useTranslation()
    const theme = useTheme()
    const COLORS = theme.palette.mode === 'dark' ? darkCategoryColors : categoryColors

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
                                    borderTopColor: COLORS[key],
                                    transition: 'box-shadow .2s',
                                    '&:hover': { boxShadow: 4 },
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, color: COLORS[key] }}>
                                    {t(`skills.categories.${key}`)}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {tags.map((skill) => {
                                        const certUrl = skillCertificates[skill]
                                        return certUrl ? (
                                            <Tooltip key={skill} title="View certificate" arrow>
                                                <Chip
                                                    label={skill}
                                                    icon={<WorkspacePremiumIcon />}
                                                    component="a"
                                                    href={certUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    clickable
                                                    sx={{
                                                        borderColor: COLORS[key],
                                                        color: '#fff',
                                                        bgcolor: COLORS[key],
                                                        '& .MuiChip-icon': { color: '#fff' },
                                                        '&:hover': { opacity: 0.85, boxShadow: 2 },
                                                    }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Chip
                                                key={skill}
                                                label={skill}
                                                variant="outlined"
                                                sx={{ borderColor: COLORS[key], color: COLORS[key] }}
                                            />
                                        )
                                    })}
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}
