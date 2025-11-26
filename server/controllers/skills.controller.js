const prisma = require('../config/database');

const getAll = async (req, res) => {
  const items = await prisma.skillCategory.findMany({ orderBy: { order: 'asc' } });
  res.json(items);
};

const getOne = async (req, res) => {
  const item = await prisma.skillCategory.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

const create = async (req, res) => {
  const { icon, category, skills, visible, order } = req.body;
  const item = await prisma.skillCategory.create({
    data: {
      icon: icon || '⚡',
      category,
      skills: skills || [],
      visible: visible ?? true,
      order: order ?? 0,
    },
  });
  res.status(201).json(item);
};

const update = async (req, res) => {
  const { icon, category, skills, visible, order } = req.body;
  const item = await prisma.skillCategory.update({
    where: { id: req.params.id },
    data: {
      ...(icon !== undefined && { icon }),
      ...(category !== undefined && { category }),
      ...(skills !== undefined && { skills }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
    },
  });
  res.json(item);
};

const remove = async (req, res) => {
  await prisma.skillCategory.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

module.exports = { getAll, getOne, create, update, remove };
