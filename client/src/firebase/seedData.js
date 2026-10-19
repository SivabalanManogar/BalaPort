// Seed data for SIVA BALAN M's Portfolio
// This data is used as fallback when Firestore is empty
// and can be imported via the Admin Dashboard

export const seedProfile = {
  name: "SIVA BALAN M",
  title: "MERN Stack Developer | Data Science Enthusiast",
  phone: "9361182924",
  email: "sivabalanmanogar@gmail.com",
  location: "Tamil Nadu, India",
  linkedin: "https://linkedin.com/in/siva-balan-m",
  github: "https://github.com/sivabalan-m",
  resumeUrl: "/resume.pdf",
  profilePhoto: "/profile.png",
  summary:
    "MERN Stack & Data Science Developer skilled in React.js, Next.js, Node.js, Express.js, MongoDB, MySQL and Python ML libraries (Pandas, Scikit-learn, Matplotlib). Built e-commerce and analytics apps with JWT auth, RESTful APIs and data-driven insights. B.Tech IT student (2023–2027), CGPA 7.41. Seeking Software Developer / Full-Stack / Data Analyst roles.",
};

export const seedProjects = [
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce app with JWT auth, admin dashboard and role-based access supporting 100+ users.",
    bullets: [
      "Full-stack e-commerce app with JWT auth, admin dashboard and role-based access supporting 100+ users.",
      "Designed RESTful APIs for product, cart and order management; optimized MongoDB queries for faster retrieval.",
    ],
    techTags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    githubLink: "https://github.com/sivabalan-m",
    liveLink: "",
    category: "Full Stack",
    featured: true,
    order: 1,
    image: "",
  },
  {
    title: "Data Science & ML Analysis",
    description:
      "Cleaned and analyzed real-world datasets; built classification/regression ML models with hyperparameter tuning.",
    bullets: [
      "Cleaned and analyzed real-world datasets; built classification/regression ML models with hyperparameter tuning.",
      "Visualized findings with Matplotlib and Seaborn to deliver actionable insights for stakeholders.",
    ],
    techTags: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn"],
    githubLink: "https://github.com/sivabalan-m",
    liveLink: "",
    category: "Data Science",
    featured: true,
    order: 2,
    image: "",
  },
  {
    title: "Real-Time Chat Application",
    description:
      "Real-time chat with WebSocket (Socket.io), JWT auth, MongoDB message persistence and online status tracking.",
    bullets: [
      "Real-time chat with WebSocket (Socket.io), JWT auth, MongoDB message persistence and online status tracking.",
      "Frontend on Vercel, backend on Render, CI/CD via GitHub.",
    ],
    techTags: ["React.js", "Node.js", "MongoDB", "Socket.io", "JWT"],
    githubLink: "https://github.com/sivabalan-m",
    liveLink: "https://vercel.com",
    category: "Full Stack",
    featured: true,
    order: 3,
    image: "",
  },
];

export const seedSkills = [
  {
    category: "Languages",
    items: ["JavaScript", "Python"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "HTML5", "CSS3"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "MySQL"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Postman", "VS Code", "JWT"],
  },
  {
    category: "ML / Data Science",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"],
  },
];

export const seedExperience = [
  {
    role: "Full Stack Developer (Project)",
    company: "",
    location: "",
    period: "2023 – Present",
    description:
      "Developed a scalable MERN application with REST APIs; implemented authentication and database integration.",
    order: 1,
  },
  {
    role: "Data Science Intern",
    company: "Vcodez",
    location: "Chennai, Tamil Nadu",
    period: "2024",
    description:
      "Fetched and processed datasets via REST APIs using Python (Requests, Pandas); applied ML for business insights; delivered visual dashboards using Matplotlib and Seaborn for stakeholder presentations.",
    order: 2,
  },
];

export const seedEducation = [
  {
    degree: "B.Tech, Information Technology",
    institution: "Kalasalingam Academy of Research and Education",
    location: "Tamil Nadu",
    period: "2023 – 2027",
    score: "CGPA: 7.41",
    order: 1,
  },
  {
    degree: "Higher Secondary (XII)",
    institution: "S.D. Eaden Matriculation Higher Secondary School",
    location: "",
    period: "",
    score: "Score: 80%",
    order: 2,
  },
];

export const seedCertifications = [
  {
    title: "Python Programming",
    issuer: "Infosys Springboard",
    link: "",
    image: "",
    order: 1,
  },
  {
    title: "Full Stack Web Development",
    issuer: "Udemy",
    link: "",
    image: "",
    order: 2,
  },
  {
    title: "Data Science & ML",
    issuer: "Vcodez",
    link: "",
    image: "",
    order: 3,
  },
];

export const seedAchievements = [
  {
    title: "4th Prize – Sustainable Career Assistance Hackathon",
    description:
      "Kumarasamy College of Engineering (team of 4; built and deployed a web-based career guidance prototype).",
    order: 1,
  },
  {
    title: "Academic Excellence",
    description: "Consistent CGPA 7.41 throughout B.Tech.",
    order: 2,
  },
];
