import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  adminGetExperience, adminCreateExperience, adminUpdateExperience,
  adminDeleteExperience, adminToggleExperienceVisible,
} from '../api/admin.api';
import DataTable from './components/DataTable';
import FormModal from './components/FormModal';
import ConfirmDialog from './components/ConfirmDialog';
import TagInput from './components/TagInput';
import { useAdminToast } from './AdminLayout';

const EMPTY = {
  company: '', role: '', location: '', startDate: '', endDate: '',
  current: false, bullets: [], tags: [], visible: true, order: 0,
};

export default function AdminExperience() {
  const toast = useAdminToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => { setLoading(true); adminGetExperience().then(setItems).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, bullets: p.bullets || [], tags: p.tags || [] }); setEditId(p.id); setModalOpen(true); };

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const save = async () => {
    if (!form.company || !form.role) return toast.error('Company and role are required');
    setSaving(true);
    try {
      if (editId) await adminUpdateExperience(editId, form);
      else await adminCreateExperience(form);
      toast.success(editId ? 'Saved' : 'Experience added');
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteExperience(deleteTarget);
      toast.success('Removed');
      setDeleteTarget(null);
      load();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  const toggleVis = async (id) => {
    try { await adminToggleExperienceVisible(id); load(); }
    catch { toast.error('Update failed'); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-ink bg-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all';
  const lbl = (txt) => <label className="block font-mono text-xs text-muted mb-1.5">{txt}</label>;

  const columns = [
    { key: 'order', label: '#', width: '50px' },
    { key: 'company', label: 'Company', render: (v, row) => (
      <div><p className="font-medium text-ink">{v}</p><p className="text-xs text-blue">{row.role}</p></div>
    )},
    { key: 'startDate', label: 'Dates', render: (v, row) => (
      <span className="font-mono text-xs text-muted">{v} — {row.current ? 'Present' : row.endDate}</span>
    )},
    { key: 'visible', label: 'Visible', render: (v, row) => (
      <button onClick={() => toggleVis(row.id)} className={`text-xs font-mono px-2 py-1 rounded-full ${v ? 'bg-green-bg text-green' : 'bg-background-alt text-muted'}`}>
        {v ? 'Live' : 'Hidden'}
      </button>
    )},
    { key: 'id', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-background-alt" aria-label="Edit"><Edit size={14} /></button>
        <button onClick={() => setDeleteTarget(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" aria-label="Delete"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex justify-between items-center">
        <p className="font-body text-sm text-muted">{items.length} entries</p>
        <button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add Experience</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No experience entries yet"
        emptyAction={<button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add</button>} />

      <FormModal open={modalOpen} title={editId ? 'Edit Experience' : 'Add Experience'} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>{lbl('Company *')}<input className={inputCls} value={form.company} onChange={(e) => set('company', e.target.value)} /></div>
            <div>{lbl('Order')}<input type="number" className={inputCls} value={form.order} onChange={(e) => set('order', +e.target.value)} /></div>
          </div>
          <div>{lbl('Job Title *')}<input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} /></div>
          <div>{lbl('Location *')}<input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>{lbl('Start Date *')}<input className={inputCls} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} placeholder="Jan 2025" /></div>
            <div>{lbl('End Date')}<input className={inputCls} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} placeholder="Apr 2025" disabled={form.current} /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={(e) => set('current', e.target.checked)} className="w-4 h-4 accent-blue" />
            <span className="font-body text-sm text-ink">Currently working here</span>
          </label>
          <div>{lbl('Tech Tags')}<TagInput value={form.tags} onChange={(v) => set('tags', v)} /></div>
          <div>
            {lbl('Bullet Points')}
            <div className="space-y-2">
              {form.bullets.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls + ' flex-1'} value={b} onChange={(e) => {
                    const arr = [...form.bullets]; arr[i] = e.target.value; set('bullets', arr);
                  }} />
                  <button type="button" onClick={() => set('bullets', form.bullets.filter((_, j) => j !== i))}
                    className="px-3 rounded-xl border border-border text-red-400 hover:bg-red-50 text-xs">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => set('bullets', [...form.bullets, ''])} className="text-blue text-sm font-body hover:underline">+ Add bullet</button>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="w-4 h-4 accent-blue" />
            <span className="font-body text-sm text-ink">Visible on Portfolio</span>
          </label>
          <div className="flex gap-3 pt-4 border-t border-border">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Experience" message="This will permanently remove this experience entry."
        onConfirm={doDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
