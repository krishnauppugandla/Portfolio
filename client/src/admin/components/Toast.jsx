import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={16} className="text-green" />,
  error: <XCircle size={16} className="text-red-500" />,
  info: <Info size={16} className="text-blue" />,
};
const BG = {
  success: 'border-green/30 bg-green-bg',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue/20 bg-blue-bg',
};

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg bg-white min-w-[260px] max-w-xs ${BG[t.type]}`}
          >
            {ICONS[t.type]}
            <span className="font-body text-sm text-ink flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted hover:text-ink transition-colors ml-1"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
