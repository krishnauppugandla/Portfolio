const prisma = require('../config/database');

const getAll = async (req, res) => {
  const items = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  res.json(items);
};

const getOne = async (req, res) => {
  const item = await prisma.experience.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

const create = async (req, res) => {
  const { company, role, location, startDate, endDate, current, bullets, tags, visible, order } = req.body;
  const item = await prisma.experience.create({
    data: {
      company, role, location, startDate,
      endDate: endDate || '',
      current: current ?? false,
      bullets: bullets || [],
      tags: tags || [],
      visible: visible ?? true,
      order: order ?? 0,
    },
  });
  res.status(201).json(item);
};

const update = async (req, res) => {
  const { company, role, location, startDate, endDate, current, bullets, tags, visible, order } = req.body;
  const item = await prisma.experience.update({
    where: { id: req.params.id },
    data: {
      ...(company !== undefined && { company }),
      ...(role !== undefined && { role }),
      ...(location !== undefined && { location }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(current !== undefined && { current }),
      ...(bullets !== undefined && { bullets }),
      ...(tags !== undefined && { tags }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
    },
  });
  res.json(item);
};

const remove = async (req, res) => {
  await prisma.experience.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

const toggleVisible = async (req, res) => {
  const item = await prisma.experience.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.experience.update({
    where: { id: req.params.id },
    data: { visible: !item.visible },
  });
  res.json(updated);
};

module.exports = { getAll, getOne, create, update, remove, toggleVisible };
