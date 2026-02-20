import { useTranslation } from 'react-i18next'
import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material'

const LANGUAGES = [
    { code: 'en', label: 'EN', tooltip: 'English' },
    { code: 'fr', label: 'FR', tooltip: 'Français' },
]

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const handleChange = (_event, newLang) => {
        if (newLang && newLang !== i18n.language) {
            i18n.changeLanguage(newLang)
        }
    }

    return (
        <ToggleButtonGroup
            value={i18n.language?.split('-')[0]} // normalise e.g. "en-US" → "en"
            exclusive
            onChange={handleChange}
            size="small"
            aria-label="language switcher"
            sx={{
                ml: 1,
                '& .MuiToggleButton-root': {
                    px: 1.2,
                    py: 0.4,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                        color: 'secondary.main',
                        bgcolor: 'transparent',
                        borderColor: 'secondary.main',
                    },
                },
            }}
        >
            {LANGUAGES.map(({ code, label, tooltip }) => (
                <Tooltip key={code} title={tooltip} arrow>
                    <ToggleButton value={code} aria-label={tooltip}>
                        {label}
                    </ToggleButton>
                </Tooltip>
            ))}
        </ToggleButtonGroup>
    )
}
