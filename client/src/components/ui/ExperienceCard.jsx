import { MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ExperienceCard({ company, role, location, startDate, endDate, current, tags, delay = 0 }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-white border border-border rounded-2xl p-6 card-hover">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display font-bold text-ink text-lg">{company}</h3>
            <p className="text-blue font-body font-medium text-sm mt-0.5">{role}</p>
          </div>
          <span className="font-mono text-xs text-muted whitespace-nowrap">
            {startDate} — {current ? 'Present' : endDate}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-muted text-xs font-body mb-4">
          <MapPin size={12} />
          <span>{location}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
