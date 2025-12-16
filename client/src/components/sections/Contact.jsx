import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, Linkedin, Send, Check, AlertCircle } from 'lucide-react';
import { submitContact, incrementVisitors } from '../../api/public.api';
import ScrollReveal from '../ui/ScrollReveal';
import { normalizeUrl } from '../../context/SettingsContext';

function CountUp({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Contact({ settings }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [visitorCount, setVisitorCount] = useState(null);

  // Build contact info rows dynamically from settings
  const githubUrl   = normalizeUrl(settings?.githubUrl);
  const linkedinUrl = normalizeUrl(settings?.linkedinUrl);
  const contactInfo = [
    settings?.email && {
      icon: Mail,
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings?.location && {
      icon: MapPin,
      label: 'Location',
      value: settings.location,
      href: null,
    },
    githubUrl && {
      icon: Github,
      label: 'GitHub',
      value: githubUrl.replace(/^https?:\/\//, ''),
      href: githubUrl,
    },
    linkedinUrl && {
      icon: Linkedin,
      label: 'LinkedIn',
      value: linkedinUrl.replace(/^https?:\/\//, ''),
      href: linkedinUrl,
    },
  ].filter(Boolean);

  useEffect(() => {
    incrementVisitors()
      .then((d) => setVisitorCount(d.count))
      .catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'At least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setStatus('loading');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border font-body text-sm text-ink bg-white transition-all duration-200 outline-none
     ${errors[field] ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-blue'}
     focus:ring-2 focus:ring-blue/10`;

  return (
    <section id="contact" className="section-padding bg-background-alt">
      <div className="container-xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="font-mono text-xs text-blue uppercase tracking-widest mb-2">{settings?.contactEyebrow || 'Get in touch'}</p>
            <h2 className="section-title">{settings?.contactHeading || "Let's build something together"}</h2>
            <p className="section-subtitle">{settings?.contactSubtext || 'Open to full-time Software and Full Stack Developer roles across the US.'}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left: info + visitor count */}
          <div className="flex flex-col gap-6">
            <ScrollReveal direction="left">
              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4 bg-white border border-border rounded-xl p-4 card-hover">
                    <div className="w-9 h-9 bg-blue-bg rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-blue" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="font-body text-sm text-ink hover:text-blue transition-colors truncate block">
                          {value}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-ink truncate">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Visitor counter */}
            {visitorCount !== null && (
              <ScrollReveal delay={0.2}>
                <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-bg rounded-lg flex items-center justify-center">
                    <span className="text-blue text-sm">👁️</span>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted">Portfolio Visitors</p>
                    <p className="font-display font-bold text-ink text-lg">
                      <CountUp target={visitorCount} />
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right: form */}
          <ScrollReveal direction="right">
            <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4" noValidate>
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  className={inputClass('name')}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <p id="name-error" className="text-red-500 text-xs font-body mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1.5" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  className={inputClass('email')}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="text-red-500 text-xs font-body mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1.5" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className={inputClass('message') + ' resize-none'}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell me about the role or project..."
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && <p id="message-error" className="text-red-500 text-xs font-body mt-1">{errors.message}</p>}
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 bg-green-bg border border-green text-green rounded-lg px-4 py-3 text-sm font-body">
                  <Check size={16} /> Message sent! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm font-body">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: status !== 'loading' ? 1.02 : 1 }}
                whileTap={{ scale: status !== 'loading' ? 0.97 : 1 }}
                className="w-full btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
