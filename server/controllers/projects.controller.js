const prisma = require('../config/database');
const { cloudinary } = require('../config/cloudinary');

const getAll = async (req, res) => {
  // TODO: add pagination here once the project list gets long enough to matter
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  res.json(projects);
};

const getOne = async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
};

const create = async (req, res) => {
  const { title, subtitle, description, liveUrl, githubUrl, imageUrl, stack, features, featured, visible, order } = req.body;
  const project = await prisma.project.create({
    data: {
      title,
      subtitle,
      description: description || '',
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      imageUrl: imageUrl || null,
      stack: stack || [],
      features: features || [],
      featured: featured ?? false,
      visible: visible ?? true,
      order: order ?? 0,
    },
  });
  res.status(201).json(project);
};

const update = async (req, res) => {
  const { title, subtitle, description, liveUrl, githubUrl, imageUrl, stack, features, featured, visible, order } = req.body;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(description !== undefined && { description }),
      ...(liveUrl !== undefined && { liveUrl }),
      ...(githubUrl !== undefined && { githubUrl }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(stack !== undefined && { stack }),
      ...(features !== undefined && { features }),
      ...(featured !== undefined && { featured }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
    },
  });
  res.json(project);
};

const remove = async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

const toggleVisible = async (req, res) => {
  const p = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!p) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.project.update({
    where: { id: req.params.id },
    data: { visible: !p.visible },
  });
  res.json(updated);
};

const toggleFeatured = async (req, res) => {
  const p = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!p) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.project.update({
    where: { id: req.params.id },
    data: { featured: !p.featured },
  });
  res.json(updated);
};

const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const updated = await prisma.project.update({
    where: { id: req.params.id },
    data: { imageUrl: req.file.path },
  });
  res.json({ imageUrl: updated.imageUrl });
};

module.exports = { getAll, getOne, create, update, remove, toggleVisible, toggleFeatured, uploadImage };
