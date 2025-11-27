const router = require('express').Router();
const ctrl = require('../controllers/public.controller');
const eduCtrl = require('../controllers/education.controller');
const { contactLimiter } = require('../middleware/rateLimiter');

router.get('/projects', ctrl.getProjects);
router.get('/experience', ctrl.getExperience);
router.get('/education', eduCtrl.getPublic);
router.get('/certifications', ctrl.getCertifications);
router.get('/skills', ctrl.getSkills);
router.get('/settings', ctrl.getSettings);
router.post('/contact', contactLimiter, ctrl.submitContact);
router.post('/visitors', ctrl.incrementVisitors);

module.exports = router;
