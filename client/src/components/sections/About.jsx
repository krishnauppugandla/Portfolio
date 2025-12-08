import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';

const DEFAULT_CHIPS = ['React.js', 'Node.js', 'PostgreSQL', 'Redis', 'TypeScript', 'AWS', 'Docker', 'Prisma'];

function CodeBlock({ onHireClick, settings }) {
  const devName  = settings?.ownerName  || 'Radha Krishna Uppugandla';
  const devRole  = settings?.ownerTitle || 'Full Stack Developer';
  const devAvail = settings?.available !== false;

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-[#30363D]">
      {/* Editor chrome */}
      <div className="bg-[#161B22] px-4 py-3 flex items-center gap-3 border-b border-[#30363D]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="font-mono text-xs text-[#6B7280] ml-1">hire_me.js</span>
      </div>

      {/* Code body */}
      <div className="bg-[#0D1117] p-6 font-mono text-[13px] leading-[1.9] overflow-x-auto">
        <div>
          <span className="code-keyword">const </span>
          <span className="code-plain">developer </span>
          <span className="code-punct">= </span>
          <span className="code-punct">{'{'}</span>
        </div>
        <div className="pl-6">
          <span className="code-prop">name</span>
          <span className="code-punct">: </span>
          <span className="code-string">"{devName}"</span>
          <span className="code-punct">,</span>
        </div>
        <div className="pl-6">
          <span className="code-prop">role</span>
          <span className="code-punct">: </span>
          <span className="code-string">"{devRole}"</span>
          <span className="code-punct">,</span>
        </div>
        <div className="pl-6">
          <span className="code-prop">stack</span>
          <span className="code-punct">: </span>
          <span className="code-punct">["</span>
          <span className="code-string">React</span>
          <span className="code-punct">", "</span>
          <span className="code-string">Node.js</span>
          <span className="code-punct">", "</span>
          <span className="code-string">PostgreSQL</span>
          <span className="code-punct">", "</span>
          <span className="code-string">Redis</span>
          <span className="code-punct">"],</span>
        </div>
        <div className="pl-6">
          <span className="code-prop">available</span>
          <span className="code-punct">: </span>
          <span className="code-bool">{devAvail ? 'true' : 'false'}</span>
          <span className="code-punct">,</span>
        </div>
        <div className="pl-6">
          <span className="code-prop">passion</span>
          <span className="code-punct">: </span>
          <span className="code-string">"Building things that actually work"</span>
        </div>
        <div><span className="code-punct">{'}'}</span><span className="code-punct">;</span></div>

        <div className="mt-4">
          <span className="code-keyword">const </span>
          <span className="code-fn">handleHiring </span>
          <span className="code-punct">= () </span>
          <span className="code-keyword">{'=> '}</span>
          <span className="code-punct">{'{'}</span>
        </div>
        <div className="pl-6">
          <span className="code-keyword">if </span>
          <span className="code-punct">(developer.</span>
          <span className="code-prop">available</span>
          <span className="code-punct">) {'{'}</span>
        </div>
        <div className="pl-12">
          <span className="code-plain">console.</span>
          <span className="code-fn">log</span>
          <span className="code-punct">(</span>
          <span className="code-string">"Great choice! Let's build something."</span>
          <span className="code-punct">);</span>
        </div>
        <div className="pl-12">
          <span className="code-fn">scrollToContact</span>
          <span className="code-punct">();</span>
          <span className="code-comment"> {'// ← runs on click'}</span>
        </div>
        <div className="pl-6"><span className="code-punct">{'}'}</span></div>
        <div><span className="code-punct">{'}'}</span><span className="code-punct">;</span></div>

        <div className="mt-4">
          <span className="code-comment">{'// Click to get in touch →'}</span>
        </div>
        <div>
          <button
            onClick={onHireClick}
            className="code-fn underline decoration-blue cursor-pointer bg-transparent border-none p-0 font-mono text-[13px] hover:opacity-80 transition-opacity"
            aria-label="Scroll to contact section"
          >
            handleHiring
          </button>
          <span className="code-punct">();</span>
          <span className="cursor-blink" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function About({ settings }) {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-xl">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-12">
            <p className="font-mono text-xs text-blue uppercase tracking-widest mb-2">{settings?.aboutEyebrow || 'About me'}</p>
            <h2 className="section-title">{settings?.aboutHeading || 'Building things that work'}</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: text + chips */}
          <ScrollReveal direction="left">
            <p className="font-body text-ink text-lg leading-relaxed mb-8">
              {settings?.aboutParagraph ||
                "Passionate about building fast, scalable web applications that solve real problems. Working across the entire stack — from clean React interfaces to robust Node.js APIs backed by PostgreSQL."}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {(settings?.skillChips?.length ? settings.skillChips : DEFAULT_CHIPS).map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background-alt rounded-xl p-4 border border-border">
                <p className="font-mono text-xs text-muted mb-1">Location</p>
                <p className="font-display font-bold text-ink">{settings?.location || 'Cincinnati, OH'}</p>
              </div>
              <div className="bg-background-alt rounded-xl p-4 border border-border">
                <p className="font-mono text-xs text-muted mb-1">Status</p>
                {settings?.available !== false ? (
                  <p className="font-display font-bold text-green flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green available-dot" />
                    Available
                  </p>
                ) : (
                  <p className="font-display font-bold text-muted flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted" />
                    Not available
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: code block */}
          <ScrollReveal direction="right">
            <CodeBlock onHireClick={scrollToContact} settings={settings} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
