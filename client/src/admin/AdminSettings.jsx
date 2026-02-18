import { useEffect, useState } from 'react';
import { adminGetSettings, adminUpdateSettings } from '../api/admin.api';
import { useAdminToast } from './AdminLayout';
import { motion } from 'framer-motion';
import TagInput from './components/TagInput';

const inputCls = 'w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-ink bg-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all';

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="mb-1.5">
        <label className="font-mono text-xs text-muted">{label}</label>
        {hint && <p className="text-light text-xs font-body mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 className="font-display font-bold text-ink text-base border-b border-border pb-3 mb-4">{title}</h2>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-blue' : 'bg-border'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-7' : 'left-1'}`} />
      </div>
      <span className="font-body text-sm text-ink">{label || (value ? 'On' : 'Off')}</span>
    </label>
  );
}

export default function AdminSettings() {
  const toast = useAdminToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetSettings()
      .then(setForm)
      .catch(() => toast.error('Failed to load settings'));
  }, []);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminUpdateSettings(form);
      setForm(updated);
      toast.success('Settings saved — portfolio updated immediately');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="space-y-4 max-w-2xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* ── Personal Info ─────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Personal Info" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name">
            <input className={inputCls} value={form.ownerName || ''} onChange={(e) => set('ownerName', e.target.value)} />
          </Field>
          <Field label="Location">
            <input className={inputCls} value={form.location || ''} onChange={(e) => set('location', e.target.value)} />
          </Field>
        </div>
        <Field label="Title / Role">
          <input className={inputCls} value={form.ownerTitle || ''} onChange={(e) => set('ownerTitle', e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className={inputCls} value={form.email || ''} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="LinkedIn URL">
          <input className={inputCls} value={form.linkedinUrl || ''} onChange={(e) => set('linkedinUrl', e.target.value)} />
        </Field>
        <Field label="GitHub URL">
          <input className={inputCls} value={form.githubUrl || ''} onChange={(e) => set('githubUrl', e.target.value)} />
        </Field>
        <Field label="Resume PDF URL" hint="Leave as /resume.pdf to use the public folder file">
          <input className={inputCls} value={form.resumeUrl || ''} onChange={(e) => set('resumeUrl', e.target.value)} />
        </Field>
        <Field label="Available for Work" hint="Controls the green badge on the hero section">
          <Toggle value={form.available} onChange={(v) => set('available', v)} label={form.available ? 'Available' : 'Not available'} />
        </Field>
        <Field label="Notification Email" hint="Contact form submissions are emailed here">
          <input type="email" className={inputCls} value={form.notifyEmail || ''} onChange={(e) => set('notifyEmail', e.target.value)} />
        </Field>
      </div>

      {/* ── Hero Section ─────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Hero Section" />
        <Field label="Available Badge Text">
          <input className={inputCls} value={form.availableBadgeText || ''} onChange={(e) => set('availableBadgeText', e.target.value)} placeholder="Open to opportunities" />
        </Field>
        <Field label="Hero Subtitle" hint="Shown below your name">
          <input className={inputCls} value={form.heroSubtitle || ''} onChange={(e) => set('heroSubtitle', e.target.value)} placeholder="Full Stack Developer — React · Node.js · PostgreSQL" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Button 1 Text">
            <input className={inputCls} value={form.ctaButton1Text || ''} onChange={(e) => set('ctaButton1Text', e.target.value)} placeholder="View Work →" />
          </Field>
          <Field label="CTA Button 2 Text">
            <input className={inputCls} value={form.ctaButton2Text || ''} onChange={(e) => set('ctaButton2Text', e.target.value)} placeholder="Let's Talk" />
          </Field>
        </div>
        <Field label="Floating Button Text" hint="The floating button shown at the bottom right of the portfolio">
          <input className={inputCls} value={form.floatingButtonText || ''} onChange={(e) => set('floatingButtonText', e.target.value)} placeholder="Build Something" />
        </Field>
      </div>

      {/* ── About Section ────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="About Section" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow Label">
            <input className={inputCls} value={form.aboutEyebrow || ''} onChange={(e) => set('aboutEyebrow', e.target.value)} placeholder="About me" />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={form.aboutHeading || ''} onChange={(e) => set('aboutHeading', e.target.value)} placeholder="Building things that work" />
          </Field>
        </div>
        <Field label="About Paragraph">
          <textarea rows={4} className={inputCls + ' resize-none'} value={form.aboutParagraph || ''} onChange={(e) => set('aboutParagraph', e.target.value)} placeholder="Write a short bio..." />
        </Field>
        <Field label="Skill Chips" hint="Tags displayed below the bio text">
          <TagInput value={form.skillChips || []} onChange={(v) => set('skillChips', v)} placeholder="React.js, Node.js..." />
        </Field>
      </div>

      {/* ── Experience Section ───────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Experience Section" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow Label">
            <input className={inputCls} value={form.experienceEyebrow || ''} onChange={(e) => set('experienceEyebrow', e.target.value)} placeholder="Work history" />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={form.experienceHeading || ''} onChange={(e) => set('experienceHeading', e.target.value)} placeholder="Where I've worked" />
          </Field>
        </div>
      </div>

      {/* ── Projects Section ─────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Projects Section" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow Label">
            <input className={inputCls} value={form.projectsEyebrow || ''} onChange={(e) => set('projectsEyebrow', e.target.value)} placeholder="Featured work" />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={form.projectsHeading || ''} onChange={(e) => set('projectsHeading', e.target.value)} placeholder="What I've built" />
          </Field>
        </div>
      </div>

      {/* ── Skills Section ───────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Skills Section" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow Label">
            <input className={inputCls} value={form.skillsEyebrow || ''} onChange={(e) => set('skillsEyebrow', e.target.value)} placeholder="Stack" />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={form.skillsHeading || ''} onChange={(e) => set('skillsHeading', e.target.value)} placeholder="Technical skills" />
          </Field>
        </div>
      </div>

      {/* ── Education Section ────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Education & Certifications Section" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow Label">
            <input className={inputCls} value={form.educationEyebrow || ''} onChange={(e) => set('educationEyebrow', e.target.value)} placeholder="Background" />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={form.educationHeading || ''} onChange={(e) => set('educationHeading', e.target.value)} placeholder="Education & Certifications" />
          </Field>
        </div>
      </div>

      {/* ── Contact Section ──────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <SectionHeader title="Contact Section" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow Label">
            <input className={inputCls} value={form.contactEyebrow || ''} onChange={(e) => set('contactEyebrow', e.target.value)} placeholder="Get in touch" />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={form.contactHeading || ''} onChange={(e) => set('contactHeading', e.target.value)} placeholder="Let's build something together" />
          </Field>
        </div>
        <Field label="Subtext">
          <input className={inputCls} value={form.contactSubtext || ''} onChange={(e) => set('contactSubtext', e.target.value)} placeholder="Open to full-time roles across the US." />
        </Field>
      </div>

      {/* Save button */}
      <motion.button
        onClick={save}
        disabled={saving}
        whileHover={{ scale: saving ? 1 : 1.02 }}
        whileTap={{ scale: saving ? 1 : 0.97 }}
        className="btn-primary disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save All Settings'}
      </motion.button>
    </div>
  );
}
