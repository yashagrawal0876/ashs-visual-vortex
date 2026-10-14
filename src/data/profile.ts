// Single source of truth for portfolio content. Add a URL to show a link; empty values stay hidden.
export const profile = {
  name: "Yash Agrawal",
  email: "yash@gmail.com",
  location: "India",
  resumeUrl: "", // e.g. "/resume.pdf" — Download Resume button appears once set
  tagline: "Aspiring Full Stack Developer | AI Enthusiast | Creative Problem Solver",
  footerTagline: "Curious mind. Creative builder. Always exploring.",
  roles: [
    "Aspiring Full Stack Developer",
    "AI Enthusiast",
    "Web Developer",
    "Programmer",
    "Creative Problem Solver",
    "Future Software Engineer",
  ],
  heroDescription:
    "I'm a second-year B.Tech student at JECRC University, exploring web development, programming, and AI while building creative digital experiences.",
  bio: [
    "I'm Yash Agrawal, a second-year B.Tech student at JECRC University with a strong interest in software development, web technologies, and artificial intelligence.",
    "I enjoy learning programming, building creative websites, and exploring modern technologies to solve real-world problems.",
    "I'm continuously improving my technical skills through coursework, experimentation, and personal projects.",
    "My goal is to become a skilled software developer and build innovative, intuitive, and meaningful digital experiences.",
  ],
  facts: [
    ["Name", "Yash Agrawal"],
    ["University", "JECRC University"],
    ["Degree", "Bachelor of Technology (B.Tech)"],
    ["Current Year", "Second Year"],
    ["CGPA", "8.0"],
    ["Focus", "Software, Web & AI"],
  ] as const,
  socials: {
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
    medium: "",
    devto: "",
  } as Record<string, string>,
};

export const learning = [
  "Programming fundamentals",
  "Web development",
  "Object-oriented programming",
  "Responsive interface design",
  "Problem-solving practice",
  "Exploration of AI-assisted development",
];

export type Skill = { name: string; group: "Languages" | "Web" | "Concepts" | "Tools"; learning?: boolean };
export const skills: Skill[] = [
  { name: "HTML5", group: "Web" },
  { name: "CSS3", group: "Web" },
  { name: "JavaScript", group: "Languages" },
  { name: "C Programming", group: "Languages" },
  { name: "C++", group: "Languages" },
  { name: "Python", group: "Languages", learning: true },
  { name: "Responsive Web Design", group: "Web" },
  { name: "Object-Oriented Programming", group: "Concepts" },
  { name: "Data Structures & Algorithms", group: "Concepts", learning: true },
  { name: "React.js", group: "Web", learning: true },
  { name: "Next.js", group: "Web", learning: true },
  { name: "Tailwind CSS", group: "Web", learning: true },
  { name: "Git & GitHub", group: "Tools", learning: true },
  { name: "AI-Assisted Development", group: "Tools" },
  { name: "UI/UX Design Fundamentals", group: "Concepts" },
  { name: "Problem Solving", group: "Concepts" },
];

export const projects = [
  {
    name: "Cosmic AI — Personal Portfolio",
    description:
      "A futuristic personal portfolio featuring an animated AI Core, cinematic space visuals, interactive project cards and smooth navigation.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    status: "In Development",
    github: "",
    demo: "",
  },
  {
    name: "Responsive Personal Portfolio",
    description:
      "A responsive website showcasing personal information, education, skills, and projects across desktop, tablet, and mobile devices.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    status: "Completed",
    github: "",
    demo: "",
  },
  {
    name: "Student Study Assistant",
    description:
      "A concept for a student-focused app that organizes study topics, manages tasks, tracks learning goals, and explores AI-powered help.",
    stack: ["React.js", "JavaScript", "Tailwind CSS", "AI API (planned)"],
    status: "Concept",
    github: "",
    demo: "",
  },
];

export const nav = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["certifications", "Certifications"],
  ["contact", "Contact"],
] as const;
