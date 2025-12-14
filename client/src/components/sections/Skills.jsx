import ScrollReveal from '../ui/ScrollReveal';
import SkillCard from '../ui/SkillCard';

export default function Skills({ skills, loading, settings }) {
  return (
    <section id="skills" className="section-padding bg-background-alt">
      <div className="container-xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="font-mono text-xs text-blue uppercase tracking-widest mb-2">
              {settings?.skillsEyebrow || 'Stack'}
            </p>
            <h2 className="section-title">{settings?.skillsHeading || 'Technical skills'}</h2>
            <p className="section-subtitle">Technologies I work with professionally</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-36 rounded-2xl" />
              ))
            : skills.map((cat, i) => (
                <SkillCard
                  key={cat.id}
                  icon={cat.icon}
                  category={cat.category}
                  skills={cat.skills}
                  delay={i * 0.07}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
