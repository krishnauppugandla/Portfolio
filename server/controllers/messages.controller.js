const prisma = require('../config/database');

const getAll = async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
};

const markRead = async (req, res) => {
  const msg = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  res.json(msg);
};

const markAllRead = async (req, res) => {
  await prisma.contactMessage.updateMany({
    where: { read: false },
    data: { read: true },
  });
  res.json({ success: true });
};

const remove = async (req, res) => {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

const getUnreadCount = async (req, res) => {
  const count = await prisma.contactMessage.count({ where: { read: false } });
  res.json({ count });
};

module.exports = { getAll, markRead, markAllRead, remove, getUnreadCount };
