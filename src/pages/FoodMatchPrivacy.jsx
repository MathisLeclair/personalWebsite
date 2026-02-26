import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider,
    Link,
    IconButton,
    Tooltip,
    useTheme,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { ColorModeContext } from '../App'
import LanguageSwitcher from '../components/LanguageSwitcher'

function RichText({ i18nKey, variant = 'body1', gutterBottom, sx }) {
    const { t } = useTranslation()
    return (
        <Typography
            variant={variant}
            gutterBottom={gutterBottom}
            sx={sx}
            dangerouslySetInnerHTML={{ __html: t(i18nKey) }}
        />
    )
}

function RichListItem({ i18nKey }) {
    const { t } = useTranslation()
    return (
        <ListItem sx={{ py: 0.25, display: 'list-item', listStyleType: 'disc', ml: 2 }}>
            <ListItemText primary={<span dangerouslySetInnerHTML={{ __html: t(i18nKey) }} />} />
        </ListItem>
    )
}

export default function FoodMatchPrivacy() {
    const { t } = useTranslation()
    const { mode, toggleColorMode } = useContext(ColorModeContext)
    const theme = useTheme()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', py: 6 }}>
            {/* Top-right controls */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 12,
                    right: 16,
                    zIndex: 1300,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: theme.palette.mode === 'light'
                        ? 'rgba(255,255,255,0.85)'
                        : 'rgba(13,13,26,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 3,
                    px: 1,
                    py: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <LanguageSwitcher />
                <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
                    <IconButton onClick={toggleColorMode} size="small" sx={{ ml: 0.5, color: 'text.primary' }}>
                        {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>

            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
                        {t('foodMatchPrivacy.title')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {t('foodMatchPrivacy.subtitle')}
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                        {t('foodMatchPrivacy.lastUpdated')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.overview_title')}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {t('foodMatchPrivacy.overview_p')}
                        </Typography>
                        <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'success.main', color: 'success.contrastText', borderColor: 'success.dark' }}>
                            <RichText i18nKey="foodMatchPrivacy.overview_highlight" variant="body2" />
                        </Paper>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.storage_title')}
                        </Typography>
                        <RichText i18nKey="foodMatchPrivacy.storage_p" gutterBottom />
                        <List dense disablePadding sx={{ pl: 1 }}>
                            <RichListItem i18nKey="foodMatchPrivacy.storage_li1" />
                            <RichListItem i18nKey="foodMatchPrivacy.storage_li2" />
                            <RichListItem i18nKey="foodMatchPrivacy.storage_li3" />
                        </List>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.camera_title')}
                        </Typography>
                        <RichText i18nKey="foodMatchPrivacy.camera_p" />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Typography variant="h6" fontWeight={600}>
                                {t('foodMatchPrivacy.network_title')}
                            </Typography>
                            <Chip label={t('foodMatchPrivacy.network_badge')} size="small" color="info" variant="outlined" />
                        </Box>
                        <Typography variant="body1" gutterBottom>
                            {t('foodMatchPrivacy.network_p')}{' '}
                            <Link href="https://world.openfoodfacts.org" target="_blank" rel="noopener">
                                Open Food Facts
                            </Link>
                        </Typography>
                        <List dense disablePadding sx={{ pl: 1 }}>
                            <RichListItem i18nKey="foodMatchPrivacy.network_li1" />
                            <ListItem sx={{ py: 0.25, display: 'list-item', listStyleType: 'disc', ml: 2 }}>
                                <ListItemText primary={t('foodMatchPrivacy.network_li2')} />
                            </ListItem>
                            <ListItem sx={{ py: 0.25, display: 'list-item', listStyleType: 'disc', ml: 2 }}>
                                <ListItemText primary={t('foodMatchPrivacy.network_li3')} />
                            </ListItem>
                        </List>
                        <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
                            {t('foodMatchPrivacy.network_cache')}
                        </Typography>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.analytics_title')}
                        </Typography>
                        <RichText i18nKey="foodMatchPrivacy.analytics_p" />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.children_title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('foodMatchPrivacy.children_p')}
                        </Typography>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.changes_title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('foodMatchPrivacy.changes_p')}
                        </Typography>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('foodMatchPrivacy.contact_title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('foodMatchPrivacy.contact_p')}{' '}
                            <strong>Mathis Leclair</strong> &mdash;{' '}
                            <Link href="https://github.com/mathisleclair" target="_blank" rel="noopener">
                                github.com/mathisleclair
                            </Link>
                        </Typography>
                    </Paper>

                </Box>

                <Divider sx={{ my: 6 }} />

                <Typography variant="body2" color="text.secondary" align="center">
                    {t('foodMatchPrivacy.contact_footer')}{' '}
                    <Box component="code" sx={{ fontFamily: 'monospace' }}>
                        fr.mathisleclair.foodmatch
                    </Box>
                </Typography>
            </Container>
        </Box>
    )
}
