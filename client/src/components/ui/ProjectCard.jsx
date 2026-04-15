import { useState } from 'react'; // was mid-file, moved to top
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';

function BrowserMockup({ url, imageUrl }) {
  const domain = url ? new URL(url).hostname : '';
  const [iframeBlocked, setIframeBlocked] = useState(false);

  return (
    <div className="browser-mockup w-full">
      {/* Chrome bar */}
      <div className="browser-chrome">
        <div className="browser-dots">
          <span className="browser-dot" style={{ background: '#FF5F57' }} />
          <span className="browser-dot" style={{ background: '#FEBC2E' }} />
          <span className="browser-dot" style={{ background: '#28C840' }} />
        </div>
        <div className="browser-urlbar">{domain}</div>
      </div>

      {/* Viewport */}
      <div className="browser-viewport">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Project screenshot"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}
        {!imageUrl && !iframeBlocked && (
          <iframe
            src={url}
            title={`Preview of ${domain}`}
            onError={() => setIframeBlocked(true)}
            loading="lazy"
          />
        )}
        {!imageUrl && iframeBlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-alt text-muted text-xs font-mono text-center p-4">
            Live preview unavailable —{' '}
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue underline ml-1">
              open site ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0;
  const accentColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  const bgColors = ['#FFF5F5', '#F0FFFE', '#F0F8FF', '#F0FFF4'];
  const accentColor = accentColors[index % accentColors.length];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
    >
      {/* Browser mockup — alternates side */}
      <div className={`${!isEven ? 'lg:order-2' : ''}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{ background: bgColor }}
          className="rounded-2xl p-6"
        >
          <BrowserMockup url={project.liveUrl} imageUrl={project.imageUrl} />
        </motion.div>
      </div>

      {/* Info */}
      <div className={`${!isEven ? 'lg:order-1' : ''} flex flex-col justify-center`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs font-medium text-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          {project.liveUrl && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-green bg-green-bg px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green rounded-full available-dot" />
              LIVE
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-3xl text-black mb-1">{project.title}</h3>
        <p className="font-body text-muted text-sm mb-5">{project.subtitle}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Live Demo
              <ExternalLink size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
