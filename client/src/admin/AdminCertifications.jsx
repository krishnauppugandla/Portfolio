import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  adminGetCertifications, adminCreateCertification,
  adminUpdateCertification, adminDeleteCertification,
} from '../api/admin.api';
import DataTable from './components/DataTable';
import FormModal from './components/FormModal';
import ConfirmDialog from './components/ConfirmDialog';
import { useAdminToast } from './AdminLayout';

const EMPTY = { name: '', issuer: '', year: '', logoColor: '#2563EB', visible: true, order: 0 };

export default function AdminCertifications() {
  const toast = useAdminToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => { setLoading(true); adminGetCertifications().then(setItems).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (p) => { setForm(p); setEditId(p.id); setModalOpen(true); };
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const save = async () => {
    if (!form.name || !form.issuer) return toast.error('Name and issuer are required');
    setSaving(true);
    try {
      if (editId) await adminUpdateCertification(editId, form);
      else await adminCreateCertification(form);
      toast.success('Saved');
      setModalOpen(false);
      load();
    } catch (e) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await adminDeleteCertification(deleteTarget); toast.success('Deleted'); setDeleteTarget(null); load(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-ink bg-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all';
  const lbl = (txt) => <label className="block font-mono text-xs text-muted mb-1.5">{txt}</label>;

  const columns = [
    { key: 'order', label: '#', width: '50px' },
    { key: 'name', label: 'Certification', render: (v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: row.logoColor }}>{row.issuer.slice(0, 2).toUpperCase()}</div>
        <div><p className="font-medium text-ink">{v}</p><p className="text-xs text-muted">{row.issuer} {row.year ? `· ${row.year}` : ''}</p></div>
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
    <div className="space-y-4 max-w-3xl">
      <div className="flex justify-between items-center">
        <p className="font-body text-sm text-muted">{items.length} certifications</p>
        <button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add Certification</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No certifications yet"
        emptyAction={<button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add</button>} />

      <FormModal open={modalOpen} title={editId ? 'Edit Certification' : 'Add Certification'} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>{lbl('Certification Name *')}<input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Azure Developer Associate" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>{lbl('Issuer *')}<input className={inputCls} value={form.issuer} onChange={(e) => set('issuer', e.target.value)} placeholder="Microsoft" /></div>
            <div>{lbl('Year')}<input className={inputCls} value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2024" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {lbl('Logo Color')}
              <div className="flex items-center gap-3">
                <input type="color" value={form.logoColor} onChange={(e) => set('logoColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                <input className={inputCls} value={form.logoColor} onChange={(e) => set('logoColor', e.target.value)} />
              </div>
            </div>
            <div>{lbl('Order')}<input type="number" className={inputCls} value={form.order} onChange={(e) => set('order', +e.target.value)} /></div>
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Certification" message="This will permanently remove this certification."
        onConfirm={doDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
