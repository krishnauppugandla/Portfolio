const prisma = require('../config/database');

const getAll = async (req, res) => {
  const items = await prisma.education.findMany({ orderBy: { order: 'asc' } });
  res.json(items);
};

const getPublic = async (req, res) => {
  const items = await prisma.education.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  res.json(items);
};

const getOne = async (req, res) => {
  const item = await prisma.education.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

const create = async (req, res) => {
  const { degree, field, school, location, startDate, endDate, visible, order } = req.body;
  if (!degree || !school) return res.status(400).json({ error: 'Degree and school are required' });
  const item = await prisma.education.create({
    data: {
      degree, field: field || '', school, location: location || '',
      startDate: startDate || '', endDate: endDate || '',
      visible: visible ?? true, order: order ?? 0,
    },
  });
  res.status(201).json(item);
};

const update = async (req, res) => {
  const { degree, field, school, location, startDate, endDate, visible, order } = req.body;
  const item = await prisma.education.update({
    where: { id: req.params.id },
    data: {
      ...(degree !== undefined && { degree }),
      ...(field !== undefined && { field }),
      ...(school !== undefined && { school }),
      ...(location !== undefined && { location }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
    },
  });
  res.json(item);
};

const remove = async (req, res) => {
  await prisma.education.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

const toggleVisible = async (req, res) => {
  const item = await prisma.education.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.education.update({
    where: { id: req.params.id },
    data: { visible: !item.visible },
  });
  res.json(updated);
};

module.exports = { getAll, getPublic, getOne, create, update, remove, toggleVisible };
