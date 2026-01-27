import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const BOOT_LINES = [
  { text: '> RADHA_KRISHNA_UPPUGANDLA.exe', delay: 0 },
  { text: '> Loading profile...', delay: 400 },
  { text: '✓ Skills: Loaded', delay: 900, color: '#059669' },
  { text: '✓ Projects: 2 deployed', delay: 1300, color: '#059669' },
  { text: '✓ Available: TRUE', delay: 1700, color: '#059669' },
  { text: "  Type 'hire' to connect →", delay: 2200, color: '#82AAFF' },
];

export default function TerminalEasterEgg() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [ready, setReady] = useState(false);
  const inputRef = useRef(null);

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Boot animation when opened
  useEffect(() => {
    if (!open) { setLines([]); setInput(''); setReady(false); return; }
    setLines([]);
    setReady(false);
    BOOT_LINES.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { text, color }]);
        if (delay === 2200) setReady(true);
      }, delay);
    });
    setTimeout(() => inputRef.current?.focus(), 2300);
  }, [open]);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      if (cmd === 'hire') {
        setOpen(false);
        setTimeout(() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else {
        setLines((prev) => [
          ...prev,
          { text: `> ${input}`, color: '#CDD3DE' },
          { text: `Command not found: ${input}. Try 'hire'.`, color: '#F78C6C' },
        ]);
        setInput('');
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-lg"
          >
            <div className="terminal-modal overflow-hidden">
              {/* Chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363D]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <span className="font-mono text-xs text-[#6B7280]">terminal — portfolio</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#6B7280] hover:text-[#CDD3DE] transition-colors"
                  aria-label="Close terminal"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 min-h-[220px]">
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className="terminal-line"
                    style={{ color: line.color || '#CDD3DE' }}
                  >
                    {line.text}
                  </div>
                ))}

                {ready && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="terminal-prompt">$</span>
                    <input
                      ref={inputRef}
                      className="terminal-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleInput}
                      placeholder="type a command..."
                      aria-label="Terminal input"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>

              <div className="px-5 py-2 border-t border-[#30363D]">
                <p className="font-mono text-xs text-[#546E7A]">Press Esc to close · Ctrl+K to reopen</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
