import api from './axios';

export const getProjects = () => api.get('/projects').then((r) => r.data);
export const getExperience = () => api.get('/experience').then((r) => r.data);
export const getCertifications = () => api.get('/certifications').then((r) => r.data);
export const getSkills = () => api.get('/skills').then((r) => r.data);
export const getSettings = () => api.get('/settings').then((r) => r.data);
export const submitContact = (data) => api.post('/contact', data).then((r) => r.data);
export const incrementVisitors = () => api.post('/visitors').then((r) => r.data);
