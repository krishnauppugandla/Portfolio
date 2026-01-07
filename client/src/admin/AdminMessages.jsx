import { useEffect, useState } from 'react';
import { Trash2, CheckCheck, Mail, MailOpen } from 'lucide-react';
import { adminGetMessages, adminMarkRead, adminMarkAllRead, adminDeleteMessage } from '../api/admin.api';
import ConfirmDialog from './components/ConfirmDialog';
import { useAdminToast } from './AdminLayout';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminMessages() {
  const toast = useAdminToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => { setLoading(true); adminGetMessages().then(setMessages).finally(() => setLoading(false)); };
  useEffect(load, []);

  const markRead = async (id) => {
    try { await adminMarkRead(id); setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, read: true } : msg)); }
    catch { toast.error('Update failed'); }
  };

  const markAll = async () => {
    try { await adminMarkAllRead(); setMessages((m) => m.map((msg) => ({ ...msg, read: true }))); toast.success('All marked as read'); }
    catch { toast.error('Update failed'); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteMessage(deleteTarget);
      toast.success('Message deleted');
      if (selected?.id === deleteTarget) setSelected(null);
      setDeleteTarget(null);
      load();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  const unread = messages.filter((m) => !m.read).length;

  if (loading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>;

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted">
          {messages.length} messages · <span className="text-blue font-medium">{unread} unread</span>
        </p>
        {unread > 0 && (
          <button onClick={markAll} className="btn-secondary text-sm">
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-4xl mb-3">📭</span>
          <p className="font-body text-muted">No messages yet. Your contact form is live!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Message list */}
          <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-background-alt transition-colors
                  ${selected?.id === msg.id ? 'bg-blue-bg' : ''}
                  ${!msg.read ? 'font-semibold' : ''}`}
              >
                <div className="w-9 h-9 bg-blue-bg rounded-full flex items-center justify-center text-blue font-display font-bold text-sm flex-shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-ink">{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 bg-blue rounded-full flex-shrink-0" />}
                  </div>
                  <p className="font-body text-xs text-muted truncate">{msg.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-mono text-xs text-light">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg.id); }}
                    className="p-1 rounded hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100"
                    aria-label="Delete message"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Message detail */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-ink text-lg">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-blue text-sm font-body hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => setDeleteTarget(selected.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="bg-background-alt rounded-xl p-4">
                  <p className="font-body text-sm text-ink leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <p className="font-mono text-xs text-muted">{new Date(selected.createdAt).toLocaleString()}</p>
                <a href={`mailto:${selected.email}`} className="btn-primary self-start">
                  <Mail size={14} />
                  Reply by Email
                </a>
              </motion.div>
            ) : (
              <div className="bg-white border border-border rounded-2xl flex items-center justify-center text-muted font-body text-sm p-6 text-center">
                Select a message to read it
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Message" message="This will permanently delete this message."
        onConfirm={doDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
