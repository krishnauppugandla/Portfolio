import ScrollReveal from '../ui/ScrollReveal';
import ExperienceCard from '../ui/ExperienceCard';

function ExperienceSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-border rounded-2xl p-6">
          <div className="skeleton h-5 w-48 mb-2 rounded" />
          <div className="skeleton h-4 w-32 mb-4 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Experience({ experience, loading, settings }) {
  return (
    <section id="experience" className="section-padding bg-background-alt">
      <div className="container-xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="font-mono text-xs text-blue uppercase tracking-widest mb-2">
              {settings?.experienceEyebrow || 'Work history '}
            </p>
            <h2 className="section-title">{settings?.experienceHeading || "Where I've worked"}</h2>
            <p className="section-subtitle">Companies I've contributed to as a Full Stack Developer</p>
          </div>
        </ScrollReveal>

        {loading ? (
          <ExperienceSkeleton />
        ) : (
          <div className="space-y-4 max-w-3xl">
            {experience.map((exp, i) => (
              <ExperienceCard key={exp.id} {...exp} delay={i * 0.08} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
