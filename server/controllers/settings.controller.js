const prisma = require('../config/database');

const get = async (req, res) => {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  // Auto-create the row if it's somehow missing (first run, etc.)
  if (!settings) settings = await prisma.siteSettings.create({ data: { id: 1 } });
  res.json(settings);
};

const update = async (req, res) => {
  // Whitelist which fields can be updated — don't just spread req.body directly,
  // that would let someone inject arbitrary columns
  const allowed = [
    'ownerName', 'ownerTitle', 'location', 'email', 'linkedinUrl', 'githubUrl',
    'resumeUrl', 'available', 'notifyEmail',
    'availableBadgeText', 'heroSubtitle', 'ctaButton1Text', 'ctaButton2Text',
    'floatingButtonText',
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
