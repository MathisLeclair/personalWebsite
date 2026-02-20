import { Suspense } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
        </ThemeProvider>
    )
}
