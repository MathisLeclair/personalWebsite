// ─── Personal information ────────────────────────────────────────────────────

export const personalInfo = {
    name: 'Mathis Leclair',
    // title & tagline come from i18n translations (hero.title / hero.tagline)
    email: 'mathis87270@gmail.com',
    phone: '+33 6 51 18 04 58',
    location: 'Paris, France',
    github: '',
    linkedin: 'https://linkedin.com/in/mathisleclair',
    twitter: '',
    avatarUrl: '/avatar.jpg',
    // CV download paths (served from /public/cv/)
    cvEn: '/cv/Mathis_Leclair_EN_CV_V5.pdf',
    cvFr: '/cv/Mathis_Leclair_FR_CV_V5.pdf',
}

// Experience data lives in i18n locale files (experience.items)
// Tags are language-agnostic and kept here for reference only.
export const experienceTags = [
    ['React', 'Angular', 'Python', 'Java', 'NestJS', 'AWS', 'Azure'],
    ['Java', 'C++', 'Node.js', 'CI/CD'],
    ['C++', 'Python', 'Node.js', 'MongoDB'],
    ['C', 'C++', 'C#', 'Python', 'Unreal Engine', 'Unity3D'],
]

// Education & skills also live in i18n locale files.
// Skill lists below are shown in Skills.jsx (tech names are language-agnostic).
export const skills = {
    frontend: ['React', 'Angular', 'Node.js', 'NestJS', 'HTML5', 'CSS3', 'TypeScript'],
    backend: ['Java', 'Python', 'C', 'C++', 'C#', 'JavaScript'],
    database_cloud: ['MongoDB', 'AWS', 'Azure'],
    tools: ['Git', 'CI/CD', 'Unity3D', 'Unreal Engine', 'Blender', 'Photoshop'],
    ai: ['LLM', 'Agentic AI', 'Prompt Engineering', 'OpenAI API'],
}

// Projects — language-agnostic fields here; translated description lives in locale files (projects.items[n].description)
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
        github: '',
        demo: '',
    },
]
