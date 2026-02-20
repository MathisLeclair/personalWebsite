import { useTranslation } from 'react-i18next'
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Link,
    Paper,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { personalInfo } from '../data/cvData'

export default function Contact() {
    const { t } = useTranslation()

    const INFO_ROWS = [
        { icon: <EmailIcon color="secondary" fontSize="large" />, label: t('contact.email_label'), value: personalInfo.email, href: `mailto:${personalInfo.email}` },
        { icon: <PhoneIcon color="secondary" fontSize="large" />, label: t('contact.phone_label'), value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
        { icon: <LocationOnIcon color="secondary" fontSize="large" />, label: t('contact.location_label'), value: personalInfo.location },
    ]

    return (
        <Box id="contact" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
            <Container maxWidth="md">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2, textAlign: 'center' }}>
                    {t('contact.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 8 }}>
                    {t('contact.subtitle')}
                </Typography>

                {/* Info cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 5 }}>
                    {INFO_ROWS.map(({ icon, label, value, href }) => (
                        <Box key={label}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                {icon}
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {label}
                                </Typography>
                                {href ? (
                                    <Link href={href} underline="hover" color="text.primary" variant="body1" fontWeight={500}>
                                        {value}
                                    </Link>
                                ) : (
                                    <Typography variant="body1" fontWeight={500}>{value}</Typography>
                                )}
                            </Paper>
                        </Box>
                    ))}
                </Box>

                {/* Social links */}
                <Stack direction="row" spacing={2} justifyContent="center">
                    {personalInfo.github && (
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<GitHubIcon />}
                            href={personalInfo.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </Button>
                    )}
                    {personalInfo.linkedin && (
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<LinkedInIcon />}
                            href={personalInfo.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="secondary"
                        >
                            LinkedIn
                        </Button>
                    )}
                </Stack>
            </Container>
        </Box>
    )
}
