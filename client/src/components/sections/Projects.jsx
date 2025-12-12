import ScrollReveal from '../ui/ScrollReveal';
import ProjectCard from '../ui/ProjectCard';

function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="skeleton h-64 rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="skeleton h-8 w-56 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="skeleton h-10 w-28 rounded-xl" />
          <div className="skeleton h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects, loading, settings }) {
  return (
    <section id="projects" className="section-padding bg-white">
      <div className="container-xl">
        <ScrollReveal>
          <div className="mb-16">
            <p className="font-mono text-xs text-blue uppercase tracking-widest mb-2">
              {settings?.projectsEyebrow || 'Featured work'}
            </p>
            <h2 className="section-title">{settings?.projectsHeading || "What I've built"}</h2>
            <p className="section-subtitle">Full-stack applications deployed and live</p>
          </div>
        </ScrollReveal>

        <div className="space-y-24">
          {loading
            ? [1, 2].map((i) => <ProjectSkeleton key={i} />)
            : projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
