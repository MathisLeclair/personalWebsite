import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { CircularProgress, Box } from '@mui/material'
import App from './App'
import './i18n' // initialise i18next before the app renders

const Loader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
    </Box>
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Suspense handles the async language load on first render */}
        <Suspense fallback={<Loader />}>
            <App />
        </Suspense>
    </React.StrictMode>
)
