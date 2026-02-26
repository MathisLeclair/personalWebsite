import { useState, useMemo, createContext, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createAppTheme } from './theme'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FoodMatchPrivacy from './pages/FoodMatchPrivacy'

export const ColorModeContext = createContext({ mode: 'light', toggleColorMode: () => { } })

function MainSite() {
    return (
        <Suspense fallback={null}>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Experience />
                <Skills />
                <Education />
                <Projects />
                <Contact />
            </main>
            <Footer />
        </Suspense>
    )
}

export default function App() {
    const [mode, setMode] = useState(
        () => localStorage.getItem('colorMode') ?? 'dark'
    )

    const colorMode = useMemo(() => ({
        mode,
        toggleColorMode: () => setMode((prev) => {
            const next = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('colorMode', next)
            return next
        }),
    }), [mode])

    const theme = useMemo(() => createAppTheme(mode), [mode])

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/foodMatch/privacy" element={<FoodMatchPrivacy />} />
                        <Route path="*" element={<MainSite />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}
