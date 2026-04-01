import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';

// Layout & special UI
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/ui/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import TerminalEasterEgg from './components/ui/TerminalEasterEgg';
import HireMeButton from './components/ui/HireMeButton';

// Public sections
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Education from './components/sections/Education';
import Contact from './components/sections/Contact';

// Public API
import { getProjects, getExperience, getCertifications, getSkills } from './api/public.api';
import api from './api/axios';

// Admin routes — lazy loaded so they don't bloat the initial bundle
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./admin/AdminProjects'));
const AdminExperience = lazy(() => import('./admin/AdminExperience'));
const AdminEducation = lazy(() => import('./admin/AdminEducation'));
const AdminCertifications = lazy(() => import('./admin/AdminCertifications'));
const AdminSkills = lazy(() => import('./admin/AdminSkills'));
const AdminMessages = lazy(() => import('./admin/AdminMessages'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-alt">
      <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-display font-bold text-6xl text-black">404</h1>
      <p className="font-body text-muted">This page doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home →</a>
    </div>
  );
}

function PortfolioPage() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState({
    projects: true, experience: true,
    education: true, certs: true, skills: true,
  });

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading((l) => ({ ...l, projects: false })));

    getExperience()
      .then(setExperience)
      .finally(() => setLoading((l) => ({ ...l, experience: false })));

    api.get('/education')
      .then((r) => setEducation(r.data))
      .catch(() => setEducation([]))
      .finally(() => setLoading((l) => ({ ...l, education: false })));

    getCertifications()
      .then(setCertifications)
      .finally(() => setLoading((l) => ({ ...l, certs: false })));

    getSkills()
      .then(setSkills)
      .finally(() => setLoading((l) => ({ ...l, skills: false })));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Experience experience={experience} loading={loading.experience} settings={settings} />
        <Projects projects={projects} loading={loading.projects} settings={settings} />
        <Skills skills={skills} loading={loading.skills} settings={settings} />
        <Education
          education={education}
          certifications={certifications}
          loading={loading.education || loading.certs}
          settings={settings}
        />
        <Contact settings={settings} />
      </main>
      <Footer />
      <HireMeButton />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <CustomCursor />
      <ScrollProgress />
      <TerminalEasterEgg />

      <Routes>
        {/* Public portfolio */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route path="dashboard"      element={<Suspense fallback={<AdminLoadingFallback />}><AdminDashboard /></Suspense>} />
          <Route path="projects"       element={<Suspense fallback={<AdminLoadingFallback />}><AdminProjects /></Suspense>} />
          <Route path="experience"     element={<Suspense fallback={<AdminLoadingFallback />}><AdminExperience /></Suspense>} />
          <Route path="education"      element={<Suspense fallback={<AdminLoadingFallback />}><AdminEducation /></Suspense>} />
          <Route path="certifications" element={<Suspense fallback={<AdminLoadingFallback />}><AdminCertifications /></Suspense>} />
          <Route path="skills"         element={<Suspense fallback={<AdminLoadingFallback />}><AdminSkills /></Suspense>} />
          <Route path="messages"       element={<Suspense fallback={<AdminLoadingFallback />}><AdminMessages /></Suspense>} />
          <Route path="settings"       element={<Suspense fallback={<AdminLoadingFallback />}><AdminSettings /></Suspense>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SettingsProvider>
  );
}
