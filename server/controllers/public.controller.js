const prisma = require('../config/database');
const { sendContactNotification } = require('../services/email.service');

const getProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  // console.log(`[projects] returning ${projects.length} items`);
  // console.log(`[projects] returning ${projects.length} items`);
  res.json(projects);
};

const getExperience = async (req, res) => {
  const experience = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  res.json(experience);
};

const getCertifications = async (req, res) => {
  const certs = await prisma.certification.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  res.json(certs);
};

const getSkills = async (req, res) => {
  const skills = await prisma.skillCategory.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  res.json(skills);
};

const getSettings = async (req, res) => {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: 1 } });
  }
  res.json(settings);
};

const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  }

  const saved = await prisma.contactMessage.create({
    data: { name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() },
  });

  // Non-blocking email — never fail the response if email fails
  sendContactNotification({ name: saved.name, email: saved.email, message: saved.message })
    .then((result) => {
      if (!result.success) console.error('Email notification failed:', result.error);
    })
    .catch((err) => console.error('Email error:', err.message));

  res.status(201).json({ success: true, id: saved.id });
};

const incrementVisitors = async (req, res) => {
  const record = await prisma.visitorCount.upsert({
    where: { id: 1 },
    update: { count: { increment: 1 } },
    create: { id: 1, count: 1 },
  });
  res.json({ count: record.count });
};

module.exports = {
  getProjects,
  getExperience,
  getCertifications,
  getSkills,
  getSettings,
  submitContact,
  incrementVisitors,
};
