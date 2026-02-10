require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database…');

  // ── Site Settings ──────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      ownerName: 'Radha Krishna Uppugandla',
      ownerTitle: 'Full Stack Developer',
      location: 'Cincinnati, OH',
      email: 'radhakrishnauppugandla08@gmail.com',
      linkedinUrl: 'https://linkedin.com/in/radhakrishna-uppugandla',
      githubUrl: 'https://github.com/krishnauppugandla',
      resumeUrl: '/resume.pdf',
      available: true,
      notifyEmail: 'radhakrishnauppugandla08@gmail.com',
      availableBadgeText: 'Open to opportunities',
      heroSubtitle: 'Full Stack Developer — React · Node.js · PostgreSQL',
      ctaButton1Text: 'View Work →',
      ctaButton2Text: "Let's Talk",
      aboutEyebrow: 'About me',
      aboutHeading: 'Building things that work',
      aboutParagraph:
        "I'm a Full Stack Developer based in Cincinnati, OH, passionate about building fast, scalable web applications that solve real problems. I work across the entire stack — from clean React interfaces to robust Node.js APIs and PostgreSQL databases.",
      skillChips: ['React.js', 'Node.js', 'PostgreSQL', 'Redis', 'TypeScript', 'AWS', 'Docker', 'Prisma'],
      experienceEyebrow: 'Work history',
      experienceHeading: "Where I've worked",
      projectsEyebrow: 'Featured work',
      projectsHeading: "What I've built",
      skillsEyebrow: 'Stack',
      skillsHeading: 'Technical skills',
      educationEyebrow: 'Background',
      educationHeading: 'Education & Certifications',
      contactEyebrow: 'Get in touch',
      contactHeading: "Let's build something together",
      contactSubtext: 'Open to full-time Software and Full Stack Developer roles across the US.',
    },
  });

  // ── Visitor Count ──────────────────────────────────────────────────────────
  await prisma.visitorCount.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, count: 0 },
  });

  // ── Projects ───────────────────────────────────────────────────────────────
  const projects = [
    {
      id: 'hungry-hub',
      order: 1,
      title: 'Hungry Hub',
      subtitle: 'Full Stack Restaurant Ordering Platform',
      description:
        'A multi-vendor restaurant ordering platform with real-time order tracking, Stripe payments, and role-based access control.',
      liveUrl: 'https://hungry-hub-opal.vercel.app/',
      githubUrl: 'https://github.com/krishnauppugandla/HungryHub',
      imageUrl: null,
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Stripe', 'JWT', 'Redis', 'Cloudinary'],
      features: [
        'Multi-vendor platform with Customer, Seller, Admin RBAC',
        'Real-time order tracking via Socket.io rooms',
        'Stripe payment integration with webhook confirmation',
        'JWT auth with httpOnly cookie refresh token rotation',
        'Promo code system with per-user usage limits',
      ],
      featured: true,
      visible: true,
    },
    {
      id: 'chat-app',
      order: 2,
      title: 'ChatApp',
      subtitle: 'Real-time Messaging Application',
      description:
        'A full-featured real-time chat application with 1:1 and group messaging, Redis-backed presence tracking, and optimistic UI.',
      liveUrl: 'https://chat-app-gray-three-37.vercel.app/',
      githubUrl: 'https://github.com/krishnauppugandla/chat-app',
      imageUrl: null,
      stack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis', 'Prisma', 'Cloudinary'],
      features: [
        '1:1 and group messaging with Socket.io rooms',
        'Redis-backed presence tracking across instances',
        'Cursor-based pagination — O(log n) performance',
        'Read receipts, typing indicators, emoji reactions',
        'Optimistic UI with server reconciliation',
      ],
      featured: true,
      visible: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  const experiences = [
    {
      id: 'exp-cdf',
      order: 1,
      company: 'Community Dreams Foundation',
      role: 'Full Stack Developer',
      location: 'Remote',
      startDate: 'Jan 2026',
      endDate: 'Apr 2026',
      current: false,
      tags: ['React.js', 'Node.js', 'APIs', 'Remote'],
      bullets: [
        'Developed React.js UI components for internal nonprofit web tools, improving usability for 500+ monthly users.',
        'Integrated third-party APIs to automate volunteer coordination workflows.',
        'Resolved frontend bugs using reusable component patterns.',
        'Collaborated via GitHub PRs, sprint planning, and daily standups.',
      ],
      visible: true,
    },
    {
      id: 'exp-uc',
      order: 2,
      company: 'University of Cincinnati',
      role: 'Full Stack Developer',
      location: 'Cincinnati, OH',
      startDate: 'Oct 2024',
      endDate: 'May 2026',
      current: true,
      tags: ['JavaScript', 'PostgreSQL', 'HTML/CSS'],
      bullets: [
        'Maintained internal web applications for 1,000+ daily users.',
        'Built UI components improving responsiveness of university digital tools.',
        'Managed PostgreSQL database records with data integrity checks.',
        'Resolved helpdesk-escalated bugs and reduced recurring support tickets.',
      ],
      visible: true,
    },
    {
      id: 'exp-dbs',
      order: 3,
      company: 'DBS Bank Asia',
      role: 'Full Stack Developer',
      location: 'Hyderabad, India',
      startDate: 'Feb 2023',
      endDate: 'Aug 2024',
      current: false,
      tags: ['React.js', 'Node.js', 'PostgreSQL', 'MongoDB'],
      bullets: [
        'Developed full-stack features for internal banking tools.',
        'Built and optimized RESTful APIs handling financial data.',
        'Worked across PostgreSQL and MongoDB for reporting and analytics.',
        'Delivered features in agile sprints with cross-functional teams.',
      ],
      visible: true,
    },
    {
      id: 'exp-smartinternz',
      order: 4,
      company: 'SmartInternz',
      role: 'Full Stack Development Extern',
      location: 'Remote',
      startDate: 'Jan 2023',
      endDate: 'May 2023',
      current: false,
      tags: ['Angular', 'Node.js', 'MongoDB'],
      bullets: [
        'Built multi-page web applications using Angular and Node.js.',
        'Developed RESTful APIs with JWT authentication and MongoDB CRUD.',
        'Participated in agile workflows and code reviews.',
      ],
      visible: true,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({ where: { id: exp.id }, update: exp, create: exp });
  }

  // ── Education ──────────────────────────────────────────────────────────────
  const education = [
    {
      id: 'edu-uc',
      order: 1,
      degree: 'Master of Engineering',
      field: 'Computer Engineering',
      school: 'University of Cincinnati',
      location: 'Cincinnati, OH',
      startDate: 'Aug 2024',
      endDate: 'May 2026',
      visible: true,
    },
    {
      id: 'edu-gec',
      order: 2,
      degree: 'Bachelor of Technology',
      field: 'Information Technology',
      school: 'Gudlavalleru Engineering College',
      location: 'Andhra Pradesh, India',
      startDate: 'Jul 2020',
      endDate: 'Apr 2024',
      visible: true,
    },
  ];

  for (const edu of education) {
    await prisma.education.upsert({ where: { id: edu.id }, update: edu, create: edu });
  }

  // ── Certifications ─────────────────────────────────────────────────────────
  const certs = [
    { id: 'cert-az204', order: 1, name: 'Azure Developer Associate', issuer: 'Microsoft', year: '2024', logoColor: '#0078D4', visible: true },
    { id: 'cert-ai900', order: 2, name: 'Azure AI Fundamentals', issuer: 'Microsoft', year: '2024', logoColor: '#0078D4', visible: true },
    { id: 'cert-wipro', order: 3, name: 'TalentNext Java Full Stack', issuer: 'Wipro', year: '2023', logoColor: '#059669', visible: true },
    { id: 'cert-udemy', order: 4, name: 'Complete 2024 Web Dev Bootcamp', issuer: 'Udemy', year: '2024', logoColor: '#A435F0', visible: true },
  ];

  for (const cert of certs) {
    await prisma.certification.upsert({ where: { id: cert.id }, update: cert, create: cert });
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  const skills = [
    { id: 'skill-lang', order: 1, icon: '💻', category: 'Languages', skills: ['JavaScript (ES6+)', 'Python', 'Java', 'C'], visible: true },
    { id: 'skill-fe', order: 2, icon: '🎨', category: 'Frontend', skills: ['React.js', 'Angular', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'], visible: true },
    { id: 'skill-be', order: 3, icon: '⚙️', category: 'Backend', skills: ['Node.js', 'Express.js', 'Socket.io', 'REST APIs', 'JWT', 'OAuth 2.0'], visible: true },
    { id: 'skill-db', order: 4, icon: '🗄️', category: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma ORM', 'Sequelize'], visible: true },
    { id: 'skill-cloud', order: 5, icon: '☁️', category: 'Cloud & DevOps', skills: ['AWS (EC2/S3/RDS/IAM)', 'Microsoft Azure', 'Docker', 'Git', 'CI/CD'], visible: true },
    { id: 'skill-int', order: 6, icon: '🔗', category: 'Integrations', skills: ['Stripe', 'Cloudinary', 'Nodemailer', 'Multer', 'Socket.io'], visible: true },
  ];

  for (const skill of skills) {
    await prisma.skillCategory.upsert({ where: { id: skill.id }, update: skill, create: skill });
  }

  // ── Admin password hash ────────────────────────────────────────────────────
  const hash = await bcrypt.hash('admin123', 12);
  console.log('\n──────────────────────────────────────────');
  console.log('Default admin credentials:');
  console.log('  Username: radha');
  console.log('  Password: admin123');
  console.log('\nPaste this into server/.env as ADMIN_PASSWORD_HASH:');
  console.log(hash);
  console.log('──────────────────────────────────────────\n');
  console.log('Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
