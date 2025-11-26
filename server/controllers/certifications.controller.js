const prisma = require('../config/database');

const getAll = async (req, res) => {
  const items = await prisma.certification.findMany({ orderBy: { order: 'asc' } });
  res.json(items);
};

const getOne = async (req, res) => {
  const item = await prisma.certification.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

const create = async (req, res) => {
  const { name, issuer, year, logoColor, visible, order } = req.body;
  const item = await prisma.certification.create({
    data: {
      name, issuer,
      year: year || null,
      logoColor: logoColor || '#2563EB',
      visible: visible ?? true,
      order: order ?? 0,
    },
  });
  res.status(201).json(item);
};

const update = async (req, res) => {
  const { name, issuer, year, logoColor, visible, order } = req.body;
  const item = await prisma.certification.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(issuer !== undefined && { issuer }),
      ...(year !== undefined && { year }),
      ...(logoColor !== undefined && { logoColor }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
    },
  });
  res.json(item);
};

const remove = async (req, res) => {
  await prisma.certification.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

module.exports = { getAll, getOne, create, update, remove };
