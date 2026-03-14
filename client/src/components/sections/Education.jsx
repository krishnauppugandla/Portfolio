import ScrollReveal from '../ui/ScrollReveal';

export default function Education({ education = [], certifications, loading, settings }) {
  return (
    <section id="education" className="section-padding bg-white">
      <div className="container-xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="font-mono text-xs text-blue uppercase tracking-widest mb-2">
              {settings?.educationEyebrow || 'Background'}
            </p>
            <h2 className="section-title">{settings?.educationHeading || 'Education & Certifications'}</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Education */}
          <div>
            <ScrollReveal>
              <h3 className="font-display font-bold text-xl text-ink mb-6">Education</h3>
            </ScrollReveal>
            <div className="space-y-4">
              {loading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="skeleton h-28 rounded-2xl" />
                  ))
                : education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <div className="bg-background-alt border border-border rounded-2xl p-6 card-hover">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                          <h4 className="font-display font-bold text-ink text-base">
                            {edu.degree} — {edu.field}
                          </h4>
                          <span className="font-mono text-xs text-muted whitespace-nowrap">
                            {edu.startDate} — {edu.endDate}
                          </span>
                        </div>
                        <p className="font-body text-blue text-sm font-medium">{edu.school}</p>
                        <p className="font-body text-muted text-xs mt-1">{edu.location}</p>
                      </div>
                    </ScrollReveal>
                  ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <ScrollReveal>
              <h3 className="font-display font-bold text-xl text-ink mb-6">Certifications</h3>
            </ScrollReveal>
            <div className="space-y-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-2xl" />
                  ))
                : certifications.map((cert, i) => (
                    <ScrollReveal key={cert.id} delay={i * 0.08}>
                      <div className="flex items-center gap-4 bg-background-alt border border-border rounded-2xl p-4 card-hover">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
                          style={{ background: cert.logoColor }}
                        >
                          {cert.issuer.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-ink text-sm truncate">{cert.name}</p>
                          <p className="font-body text-muted text-xs">
                            {cert.issuer}{cert.year ? ` · ${cert.year}` : ''}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
