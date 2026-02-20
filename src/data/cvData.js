export const personalInfo = {
    name: 'Mathis Leclair',
    // title & tagline come from i18n translations (hero.title / hero.tagline)
    email: 'mathis87270@gmail.com',
    phone: '+33 6 51 18 04 58',
    location: 'Paris, France',
    github: 'https://github.com/MathisLeclair',
    linkedin: 'https://www.linkedin.com/in/mathisleclair/',
    avatarUrl: '/avatar.jpg',
    // CV download paths (served from /public/cv/)
    cvEn: '/cv/Mathis_Leclair_EN_CV_V5.pdf',
    cvFr: '/cv/Mathis_Leclair_FR_CV_V5.pdf',
}


export const experienceTags = [
    ['React', 'Angular', 'Python', 'Java', 'NestJS', 'AWS', 'Azure'],
    ['Java', 'C++', 'Node.js', 'CI/CD'],
    ['C++', 'Python', 'Node.js', 'MongoDB'],
    ['C', 'C++', 'C#', 'Python', 'Unreal Engine', 'Unity3D'],
]

// Experience date ranges (YYYY-MM). end: null means 'present'.
// These are the source of truth for duration calculations in Experience.jsx.
export const experienceDates = [
    { start: '2022-11', end: null },
    { start: '2020-04', end: '2022-10' },
    { start: '2019-07', end: '2019-10' },
    { start: '2017-07', end: '2018-01' },
]

// Category colours — light mode (rich/dark hues that pop on white)
export const categoryColors = {
    frontend: '#e94560',
    backend: '#0f3460',
    database_cloud: '#16213e',
    ci_cd: '#b45309',
    tools: '#533483',
    ai: '#00695c',
}

// Category colours — dark mode (bright/pastel hues legible on dark backgrounds)
export const darkCategoryColors = {
    frontend: '#ff6b81',
    backend: '#64b5f6',
    database_cloud: '#4dd0e1',
    ci_cd: '#fbbf24',
    tools: '#ce93d8',
    ai: '#80cbc4',
}


export const skills = {
    frontend: ['React', 'Angular', 'Node.js', 'NestJS', 'TypeScript'],
    backend: ['Java', 'Python', 'C', 'C++', 'C#', 'JavaScript'],
    database_cloud: ['MongoDB', 'AWS', 'Azure', 'Azure SQL Server'],
    ci_cd: ['Git', 'GitHub Actions', 'Terraform', 'Docker'],
    tools: ['Git', 'CI/CD', 'Unity3D', 'Unreal Engine', 'Blender', 'Photoshop'],
    ai: ['LLM', 'Agentic AI', 'Prompt Engineering', 'OpenAI API'],
}

// Skills that have a linked certificate — skill label → URL
export const skillCertificates = {
    'React': 'https://api.certificates.dev/certificates/a0622aa1-2611-46fa-ba77-7173caf9f0df/download?signature=ddbdc59e9f70d225818929ac741656cdd167c5a3ee901c1cfe92534ce31df2d2',
}

export const projects = [
    {
        title: 'ExoLegend',
        tags: ['C', 'Embedded', 'Robotics', 'Hackathon'],
        github: 'https://github.com/MathisLeclair/exotech2025',
        demo: '',
    },
    {
        title: 'Personal Website',
        tags: ['React', 'Material UI', 'i18n', 'Vite'],
        github: 'https://github.com/MathisLeclair/personalWebsite',
        demo: '',
    },
]
