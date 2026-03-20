import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  adminGetEducation, adminCreateEducation,
  adminUpdateEducation, adminDeleteEducation, adminToggleEducationVisible,
} from '../api/admin.api';
import DataTable from './components/DataTable';
import FormModal from './components/FormModal';
import ConfirmDialog from './components/ConfirmDialog';
import { useAdminToast } from './AdminLayout';

const EMPTY = {
  degree: '', field: '', school: '', location: '',
  startDate: '', endDate: '', visible: true, order: 0,
};

export default function AdminEducation() {
  const toast = useAdminToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminGetEducation().then(setItems).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModalOpen(true); };
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const save = async () => {
    if (!form.degree || !form.school) return toast.error('Degree and school are required');
    setSaving(true);
    try {
      if (editId) await adminUpdateEducation(editId, form);
      else await adminCreateEducation(form);
      toast.success(editId ? 'Changes saved' : 'Education added');
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteEducation(deleteTarget);
      toast.success('Done');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const toggleVis = async (id) => {
    try { await adminToggleEducationVisible(id); load(); }
    catch { toast.error('Update failed'); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-ink bg-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all';
  const lbl = (txt) => <label className="block font-mono text-xs text-muted mb-1.5">{txt}</label>;

  const columns = [
    { key: 'order', label: '#', width: '50px' },
    { key: 'degree', label: 'Degree', render: (v, row) => (
      <div>
        <p className="font-medium text-ink">{v} — {row.field}</p>
        <p className="text-xs text-blue">{row.school}</p>
        <p className="text-xs text-muted">{row.location}</p>
      </div>
    )},
    { key: 'startDate', label: 'Dates', render: (v, row) => (
      <span className="font-mono text-xs text-muted">{v} — {row.endDate}</span>
    )},
    { key: 'visible', label: 'Visible', render: (v, row) => (
      <button
        onClick={() => toggleVis(row.id)}
        className={`text-xs font-mono px-2 py-1 rounded-full ${v ? 'bg-green-bg text-green' : 'bg-background-alt text-muted'}`}
      >
        {v ? 'Live' : 'Hidden'}
      </button>
    )},
    { key: 'id', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-background-alt transition-colors" aria-label="Edit">
          <Edit size={14} />
        </button>
        <button onClick={() => setDeleteTarget(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted">{items.length} education entries</p>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={14} /> Add Education
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No education entries yet"
        emptyAction={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={14} /> Add education
          </button>
        }
      />

      <FormModal
        open={modalOpen}
        title={editId ? 'Edit Education' : 'Add Education'}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              {lbl('Degree *')}
              <input className={inputCls} value={form.degree} onChange={(e) => set('degree', e.target.value)} placeholder="Bachelor of Technology" />
            </div>
            <div>
              {lbl('Field *')}
              <input className={inputCls} value={form.field} onChange={(e) => set('field', e.target.value)} placeholder="Information Technology" />
            </div>
          </div>

          <div>
            {lbl('School / University *')}
            <input className={inputCls} value={form.school} onChange={(e) => set('school', e.target.value)} placeholder="Gudlavalleru Engineering College" />
          </div>

          <div>
            {lbl('Location *')}
            <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Andhra Pradesh, India" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {lbl('Start Date *')}
              <input className={inputCls} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} placeholder="Aug 2024" />
            </div>
            <div>
              {lbl('End Date *')}
              <input className={inputCls} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} placeholder="May 2026" />
            </div>
          </div>

          <div>
            {lbl('Display Order')}
            <input type="number" className={inputCls} value={form.order} onChange={(e) => set('order', +e.target.value)} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="w-4 h-4 accent-blue" />
            <span className="font-body text-sm text-ink">Visible on Portfolio</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Education Entry"
        message="This will permanently remove this education entry."
        onConfirm={doDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
