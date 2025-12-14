import ScrollReveal from './ScrollReveal';

export default function SkillCard({ icon, category, skills, delay = 0 }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-white border border-border rounded-2xl p-6 card-hover h-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          <h3 className="font-display font-bold text-ink text-base">{category}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="tag cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
