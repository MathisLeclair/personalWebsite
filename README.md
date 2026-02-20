# Personal Website — Mathis Leclair

Interactive CV / personal portfolio built with React, Vite, and Material UI.

## Features

- **Single-page CV** — Hero, About, Experience, Skills, Education, Projects, Contact sections with smooth-scroll navigation
- **Dark / Light theme** — toggle persisted in `localStorage`, defaults to dark
- **EN / FR i18n** — full bilingual support via `i18next`, language preference persisted in `localStorage`
- **Locale-aware CV download** — downloads the matching PDF based on the active language
- **Experience durations** — per-job and total experience computed live from date ranges
- **Responsive** — mobile-first layout using MUI breakpoints
- **CI/CD** — GitHub Actions workflow deploys `dist/` to OVH Web Starter via SFTP on every push to `main`

## Tech stack

| Layer | Library / Tool |
|---|---|
| UI framework | React 19 + Vite 6 |
| Component library | Material UI v7 |
| Internationalisation | i18next v24 + react-i18next v15 |
| Styling | MUI `sx` prop + Emotion |
| Deployment | GitHub Actions → OVH SFTP |

## Project structure

```
src/
├── components/       # One file per section + Navbar, Footer, LanguageSwitcher
├── data/
│   └── cvData.js     # Single source of truth for language-agnostic data
│                     # (personal info, skills, category colours, project metadata, experience dates)
├── i18n/
│   ├── index.js      # i18next config
│   └── locales/
│       ├── en.json   # English strings + translated CV content
│       └── fr.json   # French strings + translated CV content
├── theme.js          # createAppTheme(mode) — light & dark palettes
├── App.jsx           # ColorModeContext provider + ThemeProvider
└── main.jsx          # React root + Suspense for i18n
public/
├── avatar.jpg        # Profile photo
└── cv/               # CV PDFs (EN + FR)
.github/
└── workflows/
    └── deploy-ovh.yml
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in `.github/workflows/deploy-ovh.yml`, which builds the app and uploads `dist/` to the OVH server via SFTP.

Required repository secrets:

| Secret | Description |
|---|---|
| `OVH_SSH_HOST` | SFTP server hostname |
| `OVH_SSH_USER` | SFTP username |
| `OVH_SSH_PASSWORD` | SFTP password |
| `OVH_REMOTE_DIR` | Remote path to deploy into |

## Customisation

All personal data lives in two places — edit these to make the site your own:

- **[src/data/cvData.js](src/data/cvData.js)** — contact info, skills, category colours, project metadata, experience date ranges
- **[src/i18n/locales/en.json](src/i18n/locales/en.json)** and **[fr.json](src/i18n/locales/fr.json)** — all translatable text (job titles, bullet points, descriptions, …)
