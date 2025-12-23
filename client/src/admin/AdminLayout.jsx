import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import ToastContainer from './components/Toast';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useToast } from '../hooks/useToast';
import { adminGetUnreadCount } from '../api/admin.api';

const TITLE_MAP = {
  '/admin/dashboard':       'Dashboard',
  '/admin/projects':        'Projects',
  '/admin/experience':      'Experience',
  '/admin/education':       'Education',
  '/admin/certifications':  'Certifications',
  '/admin/skills':          'Skills',
  '/admin/messages':        'Messages',
  '/admin/settings':        'Settings',
};

export const AdminToastContext = createContext(null);
export const useAdminToast = () => useContext(AdminToastContext);

export default function AdminLayout() {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();
  const { toasts, toast, removeToast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const title = TITLE_MAP[location.pathname] || 'Admin';

  useEffect(() => {
    adminGetUnreadCount()
      .then((d) => setUnreadCount(d.count))
      .catch(() => {});
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-alt">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <AdminToastContext.Provider value={toast}>
      <div className="flex h-screen bg-background-alt overflow-hidden">
        <AdminSidebar unreadCount={unreadCount} />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar title={title} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminToastContext.Provider>
  );
}
