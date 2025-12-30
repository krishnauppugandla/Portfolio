import { useEffect, useState } from 'react';
import { Plus, Edit, Eye, EyeOff, Star, Trash2, Upload } from 'lucide-react';
import {
  adminGetProjects, adminCreateProject, adminUpdateProject,
  adminDeleteProject, adminToggleProjectVisible,
  adminToggleProjectFeatured, adminUploadProjectImage,
} from '../api/admin.api';
import DataTable from './components/DataTable';
import FormModal from './components/FormModal';
import ConfirmDialog from './components/ConfirmDialog';
import TagInput from './components/TagInput';
import ImageUpload from './components/ImageUpload';
import { useAdminToast } from './AdminLayout';

const EMPTY = {
  title: '', subtitle: '', description: '', liveUrl: '', githubUrl: '',
  imageUrl: '', stack: [], features: [], featured: false, visible: true, order: 0,
};

export default function AdminProjects() {
  const toast = useAdminToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);

  const load = () => {
    setLoading(true);
    adminGetProjects().then(setProjects).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setPendingImage(null); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, stack: p.stack || [], features: p.features || [] }); setEditId(p.id); setPendingImage(null); setModalOpen(true); };

  const save = async () => {
    if (!form.title || !form.subtitle) return toast.error('Title and subtitle are required');
    setSaving(true);
    try {
      let saved;
      if (editId) {
        saved = await adminUpdateProject(editId, form);
      } else {
        saved = await adminCreateProject(form);
      }
      // Upload image if pending
      if (pendingImage && saved.id) {
        const res = await adminUploadProjectImage(saved.id, pendingImage);
        saved.imageUrl = res.imageUrl;
      }
      toast.success(editId ? 'Changes saved' : 'Project added');
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Something went wrong, try again');
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteProject(deleteTarget);
      toast.success('Project removed');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Could not delete — try again');
    } finally {
      setDeleting(false);
    }
  };

  const toggle = async (id, action) => {
    try {
      const fn = action === 'visible' ? adminToggleProjectVisible : adminToggleProjectFeatured;
      await fn(id);
      load();
    } catch { toast.error('Update failed'); }
  };

  const setFeature = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setFeatureLine = (i, val) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm((f) => ({ ...f, features: updated }));
  };

  const columns = [
    { key: 'order', label: '#', width: '50px' },
    { key: 'title', label: 'Title', render: (v, row) => (
      <div>
        <p className="font-medium text-ink">{v}</p>
        <p className="text-xs text-muted">{row.subtitle}</p>
      </div>
    )},
    { key: 'stack', label: 'Stack', render: (v) => (
      <div className="flex gap-1 flex-wrap max-w-[160px]">
        {(v || []).slice(0, 3).map((t) => (
          <span key={t} className="tag text-[10px] py-0.5 px-2">{t}</span>
        ))}
        {v?.length > 3 && <span className="font-mono text-[10px] text-muted">+{v.length - 3}</span>}
      </div>
    )},
    { key: 'visible', label: 'Visible', render: (v, row) => (
      <button onClick={() => toggle(row.id, 'visible')} className={`text-xs font-mono px-2 py-1 rounded-full ${v ? 'bg-green-bg text-green' : 'bg-background-alt text-muted'}`}>
        {v ? 'Live' : 'Hidden'}
      </button>
    )},
    { key: 'featured', label: 'Featured', render: (v, row) => (
      <button onClick={() => toggle(row.id, 'featured')} aria-label="Toggle featured">
        <Star size={15} className={v ? 'text-yellow-400 fill-yellow-400' : 'text-border'} />
      </button>
    )},
    { key: 'id', label: 'Actions', render: (_, row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-background-alt transition-colors" aria-label="Edit"><Edit size={14} /></button>
        <button onClick={() => setDeleteTarget(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" aria-label="Delete"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-ink bg-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all';
  const label = (txt) => <label className="block font-mono text-xs text-muted mb-1.5">{txt}</label>;

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted">{projects.length} projects</p>
        <button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add Project</button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        emptyMessage="No projects yet"
        emptyAction={<button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add your first project</button>}
      />

      <FormModal open={modalOpen} title={editId ? 'Edit Project' : 'Add Project'} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              {label('Title *')}
              <input className={inputCls} value={form.title} onChange={(e) => setFeature('title', e.target.value)} placeholder="Hungry Hub" />
            </div>
            <div>
              {label('Order')}
              <input type="number" className={inputCls} value={form.order} onChange={(e) => setFeature('order', +e.target.value)} />
            </div>
          </div>

          <div>
            {label('Subtitle *')}
            <input className={inputCls} value={form.subtitle} onChange={(e) => setFeature('subtitle', e.target.value)} placeholder="Full Stack Restaurant Platform" />
          </div>

          <div>
            {label('Description')}
            <textarea rows={3} className={inputCls + ' resize-none'} value={form.description} onChange={(e) => setFeature('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {label('Live URL')}
              <input className={inputCls} value={form.liveUrl} onChange={(e) => setFeature('liveUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              {label('GitHub URL')}
              <input className={inputCls} value={form.githubUrl} onChange={(e) => setFeature('githubUrl', e.target.value)} placeholder="https://github.com/..." />
            </div>
          </div>

          <div>
            {label('Tech Stack')}
            <TagInput value={form.stack} onChange={(v) => setFeature('stack', v)} placeholder="React, Node.js..." />
          </div>

          <div>
            {label('Key Features')}
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls + ' flex-1'} value={f} onChange={(e) => setFeatureLine(i, e.target.value)} />
                  <button type="button" onClick={() => setFeature('features', form.features.filter((_, j) => j !== i))}
                    className="px-3 rounded-xl border border-border text-red-400 hover:bg-red-50 transition-colors text-xs">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => setFeature('features', [...form.features, ''])}
                className="text-blue text-sm font-body hover:underline">+ Add feature</button>
            </div>
          </div>

          <div>
            {label('Project Screenshot')}
            <ImageUpload currentUrl={form.imageUrl} onFileSelect={setPendingImage} />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setFeature('featured', e.target.checked)} className="w-4 h-4 accent-blue" />
              <span className="font-body text-sm text-ink">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={(e) => setFeature('visible', e.target.checked)} className="w-4 h-4 accent-blue" />
              <span className="font-body text-sm text-ink">Visible on Portfolio</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Project'}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message="This action cannot be undone. The project will be permanently removed."
        onConfirm={doDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
