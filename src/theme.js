import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'light' ? '#1a1a2e' : '#e2e8f0',
                light: '#16213e',
                dark: '#0f3460',
            },
            secondary: {
                main: '#e94560',
            },
            background: {
                default: mode === 'light' ? '#f8f9fa' : '#0d0d1a',
                paper: mode === 'light' ? '#ffffff' : '#1a1a2e',
            },
            text: {
                primary: mode === 'light' ? '#1a1a2e' : '#e2e8f0',
                secondary: mode === 'light' ? '#6c757d' : '#94a3b8',
            },
        },
        typography: {
            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
            h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
            h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
            h3: { fontWeight: 600 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 500 },
        },
        shape: { borderRadius: 12 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 500 },
                },
            },
        },
    })
