import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminGetSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill } from '../api/admin.api';
import DataTable from './components/DataTable';
import FormModal from './components/FormModal';
import ConfirmDialog from './components/ConfirmDialog';
import TagInput from './components/TagInput';
import { useAdminToast } from './AdminLayout';

const EMPTY = { icon: '⚡', category: '', skills: [], visible: true, order: 0 };

export default function AdminSkills() {
  const toast = useAdminToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => { setLoading(true); adminGetSkills().then(setItems).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, skills: p.skills || [] }); setEditId(p.id); setModalOpen(true); };
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const save = async () => {
    if (!form.category) return toast.error('Category name is required');
    setSaving(true);
    try {
      if (editId) await adminUpdateSkill(editId, form);
      else await adminCreateSkill(form);
      toast.success('Saved');
      setModalOpen(false);
      load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await adminDeleteSkill(deleteTarget); toast.success('Category removed'); setDeleteTarget(null); load(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-ink bg-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all';
  const lbl = (txt) => <label className="block font-mono text-xs text-muted mb-1.5">{txt}</label>;

  const columns = [
    { key: 'order', label: '#', width: '50px' },
    { key: 'category', label: 'Category', render: (v, row) => (
      <div className="flex items-center gap-2"><span className="text-xl">{row.icon}</span><p className="font-medium text-ink">{v}</p></div>
    )},
    { key: 'skills', label: 'Skills', render: (v) => (
      <div className="flex gap-1 flex-wrap max-w-[240px]">
        {(v || []).slice(0, 4).map((s) => <span key={s} className="tag text-[10px] py-0.5 px-2">{s}</span>)}
        {v?.length > 4 && <span className="font-mono text-[10px] text-muted">+{v.length - 4}</span>}
      </div>
    )},
    { key: 'visible', label: 'Visible', render: (v) => (
      <span className={`text-xs font-mono px-2 py-1 rounded-full ${v ? 'bg-green-bg text-green' : 'bg-background-alt text-muted'}`}>{v ? 'Live' : 'Hidden'}</span>
    )},
    { key: 'id', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-background-alt" aria-label="Edit"><Edit size={14} /></button>
        <button onClick={() => setDeleteTarget(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" aria-label="Delete"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <p className="font-body text-sm text-muted">{items.length} categories</p>
        <button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add Category</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No skill categories yet"
        emptyAction={<button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add</button>} />

      <FormModal open={modalOpen} title={editId ? 'Edit Skill Category' : 'Add Skill Category'} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>{lbl('Icon (emoji)')}<input className={inputCls + ' text-2xl'} value={form.icon} onChange={(e) => set('icon', e.target.value)} /></div>
            <div className="col-span-2">{lbl('Category Name *')}<input className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Frontend" /></div>
          </div>
          <div>{lbl('Skills')}<TagInput value={form.skills} onChange={(v) => set('skills', v)} placeholder="React.js, TypeScript..." /></div>
          <div>{lbl('Order')}<input type="number" className={inputCls} value={form.order} onChange={(e) => set('order', +e.target.value)} /></div>
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Skill Category" message="This will permanently remove this skill category."
        onConfirm={doDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
