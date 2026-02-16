const prisma = require('../config/database');

const get = async (req, res) => {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) settings = await prisma.siteSettings.create({ data: { id: 1 } });
  res.json(settings);
};

const update = async (req, res) => {
  const allowed = [
    'ownerName', 'ownerTitle', 'location', 'email', 'linkedinUrl', 'githubUrl',
    'resumeUrl', 'available', 'notifyEmail',
    'availableBadgeText', 'heroSubtitle', 'ctaButton1Text', 'ctaButton2Text',
    'aboutEyebrow', 'aboutHeading', 'aboutParagraph', 'skillChips',
    'experienceEyebrow', 'experienceHeading',
    'projectsEyebrow', 'projectsHeading',
    'skillsEyebrow', 'skillsHeading',
    'educationEyebrow', 'educationHeading',
    'contactEyebrow', 'contactHeading', 'contactSubtext',
  ];

  const data = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) data[key] = req.body[key];
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  res.json(settings);
};

module.exports = { get, update };
