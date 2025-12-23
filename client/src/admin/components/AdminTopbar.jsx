import { ExternalLink } from 'lucide-react';

export default function AdminTopbar({ title }) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="font-display font-bold text-ink text-lg">{title}</h1>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-body text-muted hover:text-blue transition-colors"
      >
        View Portfolio
        <ExternalLink size={14} />
      </a>
    </header>
  );
}
