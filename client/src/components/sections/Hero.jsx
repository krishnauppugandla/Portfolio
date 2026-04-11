import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { normalizeUrl } from '../../context/SettingsContext';

// Floating particle dots (Framer Motion only, no Three.js)
function ParticleDots() {
  const dots = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-blue"
          // subtle grid bg — just CSS, no library needed
      style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: 0.12,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: dot.dur, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function Hero({ settings }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Split owner name: last word is surname, rest is first name
  const fullName  = settings?.ownerName || 'Radha Krishna Uppugandla';
  const nameParts = fullName.trim().split(' ');
  const lastName  = nameParts.length > 1 ? nameParts.pop() : '';
  const firstName = nameParts.join(' ');

  const githubUrl   = normalizeUrl(settings?.githubUrl);
  const linkedinUrl = normalizeUrl(settings?.linkedinUrl);
  const emailHref   = settings?.email ? `mailto:${settings.email}` : null;

  const socialLinks = [
    githubUrl   && { icon: Github,   href: githubUrl,   label: 'GitHub' },
    linkedinUrl && { icon: Linkedin, href: linkedinUrl, label: 'LinkedIn' },
    emailHref   && { icon: Mail,     href: emailHref,   label: 'Email' },
  ].filter(Boolean);

  const isAvailable = settings?.available !== false;
  const badgeText   = isAvailable
    ? (settings?.availableBadgeText || 'Open to opportunities')
    : 'Currently unavailable';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-[60px] overflow-hidden bg-white"
      // subtle grid bg — just CSS, no library needed
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }}
    >
      <ParticleDots />

      <div className="container-xl w-full px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Text ── */}
          <div className="flex flex-col">
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start mb-6 px-3 py-1.5 rounded-full bg-green-bg border border-green text-green text-xs font-mono font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-green available-dot" />
              {badgeText}
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-none mb-2"
            >
              <span className="text-black">{firstName}</span>
              {lastName && (
                <>
                  <br />
                  <span className="text-light">{lastName}</span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-body text-lg text-muted mt-4 mb-8"
            >
              {settings?.heroSubtitle || 'Full Stack Developer — React · Node.js · PostgreSQL'}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <button onClick={() => scrollTo('projects')} className="btn-primary">
                {settings?.ctaButton1Text || 'View Work →'}
              </button>
              <button onClick={() => scrollTo('contact')} className="btn-secondary">
                {settings?.ctaButton2Text || "Let's Talk"}
              </button>
            </motion.div>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-blue hover:border-blue transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Right: stat cards ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Stat cards */}
            <div className="flex flex-col gap-3">
              {/* Card 1 — full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="stat-card"
              >
                <p className="stat-label">Based in</p>
                <p className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {settings?.location || 'Cincinnati, OH'}
                </p>
                <p className="stat-sub">Open to relocate anywhere in the US</p> {/* could make this a settings field too */}
              </motion.div>

              {/* Cards 2 + 3 — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.48 }}
                  className="stat-card"
                >
                  <p className="stat-label">Worked at</p>
                  <p className="stat-value" style={{ fontSize: '2rem' }}>4</p>
                  <p className="stat-sub">Companies</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.56 }}
                  className="stat-card"
                >
                  <p className="stat-label">Deployed live</p>
                  <p className="stat-value" style={{ fontSize: '2rem' }}>2</p>
                  <p className="stat-sub">Projects</p>
                </motion.div>
              </div>

              {/* Card 4 — full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.64 }}
                className="stat-card"
              >
                <p className="stat-label">Education</p>
                <p className="stat-value" style={{ fontSize: '1.4rem' }}>M.Eng. Computer Engineering</p>
                <p className="stat-sub">University of Cincinnati · May 2026</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-light">scroll</span>
        <motion.div
          className="w-px h-8 bg-border"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
