import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
    Link,
    Paper,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import SendIcon from '@mui/icons-material/Send'
import { personalInfo } from '../data/cvData'

export default function Contact() {
    const { t } = useTranslation()
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState(null) // 'success' | 'error' | null

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: replace with your preferred form submission logic (EmailJS, Formspree, etc.)
        console.log('Form submitted', form)
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
    }

    const INFO_ROWS = [
        { icon: <EmailIcon color="secondary" />, label: t('contact.email_label'), value: personalInfo.email, href: `mailto:${personalInfo.email}` },
        { icon: <PhoneIcon color="secondary" />, label: t('contact.phone_label'), value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
        { icon: <LocationOnIcon color="secondary" />, label: t('contact.location_label'), value: personalInfo.location },
    ]

    return (
        <Box id="contact" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2, textAlign: 'center' }}>
                    {t('contact.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 8 }}>
                    {t('contact.subtitle')}
                </Typography>

                <Grid container spacing={5}>
                    {/* Info panel */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {INFO_ROWS.map(({ icon, label, value, href }) => (
                                <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{ mt: 0.5 }}>{icon}</Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                                        {href ? (
                                            <Link href={href} underline="hover" color="text.primary" variant="body2">{value}</Link>
                                        ) : (
                                            <Typography variant="body2">{value}</Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}

                            {/* Social links */}
                            <Stack direction="row" spacing={1} pt={1}>
                                {personalInfo.github && (
                                    <Button startIcon={<GitHubIcon />} href={personalInfo.github} target="_blank" rel="noopener noreferrer" size="small">
                                        GitHub
                                    </Button>
                                )}
                                <Button startIcon={<LinkedInIcon />} href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" size="small" color="secondary">
                                    LinkedIn
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Contact form */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: '1px solid', borderColor: 'divider' }}>
                            {status === 'success' && (
                                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setStatus(null)}>
                                    {t('contact.form.success')}
                                </Alert>
                            )}
                            {status === 'error' && (
                                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setStatus(null)}>
                                    {t('contact.form.error')}
                                </Alert>
                            )}

                            <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact.form.name')}
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact.form.email')}
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    label={t('contact.form.message')}
                                    name="message"
                                    multiline
                                    rows={5}
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                />
                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<SendIcon />}
                                        sx={{ bgcolor: 'primary.main' }}
                                    >
                                        {t('contact.form.submit')}
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
