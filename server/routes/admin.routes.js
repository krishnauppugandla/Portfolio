const router = require('express').Router();
const auth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const authCtrl = require('../controllers/auth.controller');
const projectsCtrl = require('../controllers/projects.controller');
const experienceCtrl = require('../controllers/experience.controller');
const educationCtrl = require('../controllers/education.controller');
const certsCtrl = require('../controllers/certifications.controller');
const skillsCtrl = require('../controllers/skills.controller');
const messagesCtrl = require('../controllers/messages.controller');
const settingsCtrl = require('../controllers/settings.controller');

// Auth
router.post('/login', authCtrl.login);
router.get('/verify', auth, authCtrl.verify);

// Projects
router.get('/projects', auth, projectsCtrl.getAll);
router.get('/projects/:id', auth, projectsCtrl.getOne);
router.post('/projects', auth, projectsCtrl.create);
router.put('/projects/:id', auth, projectsCtrl.update);
router.delete('/projects/:id', auth, projectsCtrl.remove);
router.patch('/projects/:id/toggle-visible', auth, projectsCtrl.toggleVisible);
router.patch('/projects/:id/toggle-featured', auth, projectsCtrl.toggleFeatured);
router.post('/projects/:id/upload-image', auth, upload.single('image'), projectsCtrl.uploadImage);

// Experience
router.get('/experience', auth, experienceCtrl.getAll);
router.get('/experience/:id', auth, experienceCtrl.getOne);
router.post('/experience', auth, experienceCtrl.create);
router.put('/experience/:id', auth, experienceCtrl.update);
router.delete('/experience/:id', auth, experienceCtrl.remove);
router.patch('/experience/:id/toggle-visible', auth, experienceCtrl.toggleVisible);

// Education
router.get('/education', auth, educationCtrl.getAll);
router.get('/education/:id', auth, educationCtrl.getOne);
router.post('/education', auth, educationCtrl.create);
router.put('/education/:id', auth, educationCtrl.update);
router.delete('/education/:id', auth, educationCtrl.remove);
router.patch('/education/:id/toggle-visible', auth, educationCtrl.toggleVisible);

// Certifications
router.get('/certifications', auth, certsCtrl.getAll);
router.get('/certifications/:id', auth, certsCtrl.getOne);
router.post('/certifications', auth, certsCtrl.create);
router.put('/certifications/:id', auth, certsCtrl.update);
router.delete('/certifications/:id', auth, certsCtrl.remove);

// Skills
router.get('/skills', auth, skillsCtrl.getAll);
router.get('/skills/:id', auth, skillsCtrl.getOne);
router.post('/skills', auth, skillsCtrl.create);
router.put('/skills/:id', auth, skillsCtrl.update);
router.delete('/skills/:id', auth, skillsCtrl.remove);

// Messages
router.get('/messages', auth, messagesCtrl.getAll);
router.get('/messages/unread-count', auth, messagesCtrl.getUnreadCount);
router.patch('/messages/:id/read', auth, messagesCtrl.markRead);
router.patch('/messages/read-all', auth, messagesCtrl.markAllRead);
router.delete('/messages/:id', auth, messagesCtrl.remove);

// Settings
router.get('/settings', auth, settingsCtrl.get);
router.put('/settings', auth, settingsCtrl.update);

module.exports = router;
