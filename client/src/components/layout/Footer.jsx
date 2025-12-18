import { Github, Linkedin, Mail } from 'lucide-react';
import { useSettings, normalizeUrl } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const githubUrl   = normalizeUrl(settings?.githubUrl);
  const linkedinUrl = normalizeUrl(settings?.linkedinUrl);
  const emailHref   = settings?.email ? `mailto:${settings.email}` : null;
  const ownerName   = settings?.ownerName || '';

  return (
    <footer className="border-t border-border bg-background-alt py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display font-bold text-lg text-black">
          RK<span className="text-blue">.</span>
        </div>

        <p className="font-body text-sm text-muted text-center">
          © {new Date().getFullYear()} {ownerName}. Built with React &amp; Node.js.
        </p>

        <div className="flex items-center gap-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-ink transition-colors"
            >
              <Github size={18} />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-blue transition-colors"
            >
              <Linkedin size={18} />
            </a>
          )}
          {emailHref && (
            <a
              href={emailHref}
              aria-label="Email"
              className="text-muted hover:text-ink transition-colors"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
