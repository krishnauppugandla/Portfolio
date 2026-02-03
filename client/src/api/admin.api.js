import api from './axios';

// Auth
export const adminLogin = (creds) => api.post('/admin/login', creds).then((r) => r.data);
export const adminVerify = () => api.get('/admin/verify').then((r) => r.data);

// Projects
export const adminGetProjects = () => api.get('/admin/projects').then((r) => r.data);
export const adminCreateProject = (data) => api.post('/admin/projects', data).then((r) => r.data);
export const adminUpdateProject = (id, data) => api.put(`/admin/projects/${id}`, data).then((r) => r.data);
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`).then((r) => r.data);
export const adminToggleProjectVisible = (id) => api.patch(`/admin/projects/${id}/toggle-visible`).then((r) => r.data);
export const adminToggleProjectFeatured = (id) => api.patch(`/admin/projects/${id}/toggle-featured`).then((r) => r.data);
export const adminUploadProjectImage = (id, file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post(`/admin/projects/${id}/upload-image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

// Education
export const adminGetEducation = () => api.get('/admin/education').then((r) => r.data);
export const adminCreateEducation = (data) => api.post('/admin/education', data).then((r) => r.data);
export const adminUpdateEducation = (id, data) => api.put(`/admin/education/${id}`, data).then((r) => r.data);
export const adminDeleteEducation = (id) => api.delete(`/admin/education/${id}`).then((r) => r.data);
export const adminToggleEducationVisible = (id) => api.patch(`/admin/education/${id}/toggle-visible`).then((r) => r.data);

// Experience
export const adminGetExperience = () => api.get('/admin/experience').then((r) => r.data);
export const adminCreateExperience = (data) => api.post('/admin/experience', data).then((r) => r.data);
export const adminUpdateExperience = (id, data) => api.put(`/admin/experience/${id}`, data).then((r) => r.data);
export const adminDeleteExperience = (id) => api.delete(`/admin/experience/${id}`).then((r) => r.data);
export const adminToggleExperienceVisible = (id) => api.patch(`/admin/experience/${id}/toggle-visible`).then((r) => r.data);

// Certifications
export const adminGetCertifications = () => api.get('/admin/certifications').then((r) => r.data);
export const adminCreateCertification = (data) => api.post('/admin/certifications', data).then((r) => r.data);
export const adminUpdateCertification = (id, data) => api.put(`/admin/certifications/${id}`, data).then((r) => r.data);
export const adminDeleteCertification = (id) => api.delete(`/admin/certifications/${id}`).then((r) => r.data);

// Skills
export const adminGetSkills = () => api.get('/admin/skills').then((r) => r.data);
export const adminCreateSkill = (data) => api.post('/admin/skills', data).then((r) => r.data);
export const adminUpdateSkill = (id, data) => api.put(`/admin/skills/${id}`, data).then((r) => r.data);
export const adminDeleteSkill = (id) => api.delete(`/admin/skills/${id}`).then((r) => r.data);

// Messages
export const adminGetMessages = () => api.get('/admin/messages').then((r) => r.data);
export const adminGetUnreadCount = () => api.get('/admin/messages/unread-count').then((r) => r.data);
export const adminMarkRead = (id) => api.patch(`/admin/messages/${id}/read`).then((r) => r.data);
export const adminMarkAllRead = () => api.patch('/admin/messages/read-all').then((r) => r.data);
export const adminDeleteMessage = (id) => api.delete(`/admin/messages/${id}`).then((r) => r.data);

// Settings
export const adminGetSettings = () => api.get('/admin/settings').then((r) => r.data);
export const adminUpdateSettings = (data) => api.put('/admin/settings', data).then((r) => r.data);
